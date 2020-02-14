import Decimal from 'decimal.js'
import Core from '@nervosnetwork/ckb-sdk-core'

import {
  ILogger, IUTXOTransaction, IUTXOHDWallet, IUTXOFromToParam, IUTXOUnspent, IUTXOInput, IUTXOApiProvider, IKeypair, binStr,
  OneChainError,
  RPCNode, UTXOProvider,
} from '@onechain/core'

import { ISystemScript, IInput } from './interface'
import { MAINNET } from './const'
import { logger as innerLogger } from './log'
import * as helper from './helper'
import { HDWallet } from './HDWallet'
import { Transaction } from './Transaction'
import { BlockABC } from './api-providers'

/**
 * CKB
 *
 * @export
 * @class CKB
 * @extends {UTXOProvider}
 */
export class CKB extends UTXOProvider {
  readonly logger = innerLogger
  readonly helper = helper
  readonly name = 'CKB'

  protected _apiProvider: IUTXOApiProvider
  protected _network: any
  protected _core: Core

  get network (): any {
    return this._network
  }

  constructor ({ rpcnode, keypairs = [], logger = null }: { rpcnode: RPCNode, keypairs?: IKeypair[], logger?: ILogger }) {
    super()
    this.init({ rpcnode, keypairs, logger })
  }

  init (
    { rpcnode, keypairs = [], logger = null }:
    { rpcnode: RPCNode, keypairs?: IKeypair[], logger?: ILogger }
  ): this {
    super.init({ rpcnode, keypairs, logger })

    this.setRPCNode({ rpcnode })
    this.setKeypairs({ keypairs })

    this._core = new Core(this._rpcnode.baseUrl + '/rpc_relay')

    return this
  }

  setKeypairs ({ keypairs }: { keypairs: IKeypair[] }): void {
    this.logger.info('UTXOProvider.setKeypairs')
    this.logger.debug('UTXOProvider.setKeypairs:', keypairs.map((keypair: IKeypair): string => keypair.address))
    !PROD && this.logger.trace('UTXOProvider.setKeypairs:', keypairs)

    this._keypairs = keypairs
  }

  setRPCNode ({ rpcnode }: { rpcnode: RPCNode }): void {
    this.logger.info('UTXOProvider.setRPCNode')
    this.logger.debug('UTXOProvider.setRPCNode:', rpcnode)

    this._rpcnode = rpcnode
    this._network = this.helper.getNetworkByChainId(rpcnode.chainId)
    this._apiProvider = this._getApiProvider({ rpcnode })
  }

  /**
   * Sign transaction
   *
   * @param {IRawTransaction} transaction
   * @param {IUTXOUnspent[]} unspents
   * @return {string}
   */
  sign ({ transaction, unspents }: { transaction: RPC.RawTransaction, unspents: IUTXOUnspent[] }): any {
    this.logger.debug('UTXOProvider.sign')
    this.logger.trace('UTXOProvider.sign:', transaction, unspents)

    if (unspents.length <= 0) {
      throw OneChainError.fromCode(121)
    }

    const wallets = new Map<string, string>()

    const cells: IInput[] = unspents.map((unspent: IUTXOInput): IInput => {
      if (this?._keypairs.length > 0) {
        const keypair = this._keypairs.find((keypair: IKeypair): boolean => {
          return keypair.address === unspent.address
        })

        if (!keypair) {
          throw OneChainError.fromCode(117)
        }

        wallets.set(unspent.lockHash, keypair.privateKey)
      }

      return {
        previousOutput: {
          index: new Decimal(unspent.vout).toHex(),
          txHash: unspent.txId
        },
        since: '0x0',
        lock: unspent.lock,
        lockHash: unspent.lockHash,
        outPoint: {
          txHash: unspent.txId,
          index: new Decimal(unspent.vout).toHex()
        },
      }
    })

    // @ts-ignore
    let tx: IRawTransaction = this.helper.toCamelCaseTransaction(transaction)

    // @ts-ignore
    tx = this._core.signTransaction(wallets)(tx, cells)

    // rpc do not allow redundant fields
    tx.inputs.forEach((input: IInput) => {
      delete input.lock
      delete input.lockHash
      delete input.outPoint
    })

    return this.helper.toSnakeCaseTransaction(tx)
  }

  /**
   * Build transaction
   *
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {binStr[]} [memos=[]]
   * @return {Promise<Transaction>}
   */
  async buildTransaction (
    { froms, tos, changeAddress, memos = [] }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], changeAddress: string, memos?: binStr[] }
  ): Promise<IUTXOTransaction> {
    this.logger.info('UTXOProvider.buildTransaction')
    return this._buildTransaction({ froms, tos, changeAddress })
  }

  /**
   * Build transaction with autofix
   *
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {binStr[]} [memos=[]]
   * @return {Promise<Transaction>}
   */
  async buildAutoFixTransaction (
    { froms, tos, changeAddress, memos = [] }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], changeAddress: string, memos?: binStr[] }
  ): Promise<IUTXOTransaction> {
    this.logger.info('UTXOProvider.buildAutoFixTransaction')
    return this._buildTransaction({ froms, tos, changeAddress, autoFix: true })
  }

  /**
   * Push transaction
   *
   * @param {IUTXOTransaction|string} transaction
   * @return {Promise<string>}
   */
  async pushTransaction ({ transaction }: { transaction: IUTXOTransaction | string }): Promise<string> {
    this.logger.info('UTXOProvider.push')

    let ret
    if (this.helper.isUTXOTransaction(transaction)) {
      ret = await this._apiProvider.pushTransaction(transaction.rawTransaction)
    }
    else {
      ret = await this._apiProvider.pushTransaction((transaction as string))
    }
    return ret
  }

  /**
   * Create HD wallet from mnemonic
   *
   * @param {string} mnemonic
   * @param {string | string[]} path
   * @param {boolean} [needSync=true]
   * @return {Promise<HDWallet>}
   */
  async hdwalletFromMnemonic (
    { mnemonic, path, needSync = true }:
    { mnemonic: string, path: string | string[], needSync?: boolean }
  ): Promise<IUTXOHDWallet> {
    if (this.helper.isArray(path)) {
      path = path.map((v): string => this.helper.trimEnd(v, '/'))
    }
    else {
      path = this.helper.trimEnd(path, '/')
    }

    this.logger.info('UTXOProvider.hdwalletFromMnemonic')

    let hdwallet: IUTXOHDWallet
    try {
      hdwallet = await this._buildHDWalletFromMnemonic({
        mnemonic,
        path,
        needSync,
      })
    }
    catch (e) {
      if (e.message.startsWith('Expected BIP32Path')) {
        throw OneChainError.fromCode(122)
      }

      throw e
    }

    this.setKeypairs({ keypairs: hdwallet.getKeypairs({}) })
    return hdwallet
  }

  /**
   * Create HD wallet from json
   *
   * @param {*} json
   * @return {Promise<HDWallet>}
   */
  async hdwalletFromJSON ({ json }: { json: any }): Promise<IUTXOHDWallet> {
    this.logger.info('UTXOProvider.hdwalletFromJSON')

    const hdwallet = await this._buildHDWalletFromJSON(json)
    this.setKeypairs({ keypairs: hdwallet.getKeypairs({}) })
    return hdwallet
  }

  protected _getApiProvider ({ rpcnode }: { rpcnode: RPCNode }): IUTXOApiProvider {
    if (rpcnode.baseUrl.match(/abcwallet\.com/)) {
      return new BlockABC(rpcnode)
    }
    else {
      this.logger.error('CKB._getApiProvider unspported api: ' + rpcnode.baseUrl)
      throw OneChainError.fromCode(100)
    }
  }

  protected async _loadSystemInfo (): Promise<ISystemScript> {
    // this is static for main network
    if (this._network.id === MAINNET.id) {
      return {
        // @ts-ignore
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        outPoint: {
          txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
          index: '0x0',
        },
      }
    }
    // retrieve throw rpc for other network
    else {
      const systemCell = await this._core.loadSecp256k1Dep()
      return {
        // @ts-ignore
        hashType: systemCell.hashType,
        codeHash: this.helper.padHexPrefix(systemCell.codeHash),
        outPoint: {
          txHash: this.helper.padHexPrefix(systemCell.outPoint.txHash),
          index: systemCell.outPoint.index,
        },
      }
    }
  }

  /**
   * Build transaction
   *
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {boolean} [autoFix=false]
   * @return {Promise<Transaction>}
   */
  async _buildTransaction (
    { froms, tos, changeAddress, autoFix = false }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], changeAddress: string, autoFix?: boolean }
  ): Promise<Transaction> {
    this.logger.info('CKB._buildTransaction')

    tos.forEach((to: IUTXOFromToParam): void => {
      to.value = new Decimal(to.value)
    })

    const unspents = await this._apiProvider.getUnspentOfAddresses(froms.map((from): string => from.address))
    const systemInfo = await this._loadSystemInfo()

    return (new Transaction()).init({
      systemInfo,
      froms,
      tos,
      changeAddress,
      unspents,
      autoFix,
      keypairs: this._keypairs,
      network: this._network,
    })
  }

  protected async _buildHDWalletFromMnemonic (
    { mnemonic, path, needSync = true }:
    { mnemonic: string, path: string | string[], needSync?: boolean }
  ): Promise<HDWallet> {
    return HDWallet.fromMnemonic({
      mnemonic,
      path,
      rpcnode: this._rpcnode,
      apiProvider: this._apiProvider,
      needSync,
    })
  }

  protected async _buildHDWalletFromJSON (json: any): Promise<HDWallet> {
    return HDWallet.fromJSON({
      data: json,
      rpcnode: this._rpcnode,
      apiProvider: this._apiProvider,
    })
  }
}

export default CKB
