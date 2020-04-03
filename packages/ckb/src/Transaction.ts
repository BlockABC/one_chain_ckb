import Decimal from 'decimal.js'
import Core from '@nervosnetwork/ckb-sdk-core'

import {
  IUTXOTransaction, IUTXOFromToParam, IUTXOTo, IUTXOFrom, IUTXOUnspent, IUTXOInput, IUTXOOutput, IKeypair, binStr,
  OneChainError,
} from '@onechain/core'

import { IInput, IOutput, IRawTransaction, ISystemScript, INetwork } from './interface'
import { DepType } from './const'
import { logger } from './log'
import * as helper from './helper'
import { transactionHelper } from './TransactionHelper'
import LockUtils from './lock-utils'

/**
 * Transaction
 *
 * @export
 * @class Transaction
 * @implements {IUTXOTransaction}
 */
export class Transaction implements IUTXOTransaction {
  readonly logger = logger
  readonly helper = helper
  readonly transactionHelper = transactionHelper

  protected _keypairs: IKeypair[]
  protected _network: any
  protected _froms: IUTXOFrom[] // from addresses
  protected _tos: IUTXOTo[] // to addresses and values

  /**
   * It is hard to calculate output value correctlly from outside, because fee is unknown before transaction is created.
   * This will automatically fix output value so that user do not need to take care of fee any more.
   */
  protected _autoFix = false // if autofix is on

  protected _unspents: IUTXOUnspent[] // available unspents
  protected _inputs: IUTXOInput[] // inputs
  protected _outputs: IUTXOOutput[] // outputs, include changes
  protected _changes: IUTXOOutput[] // outputs that is changes
  protected _value: Decimal // total output value
  protected _fee: Decimal // transaction fee
  protected _waste: Decimal // waste value, will not be empty when change <= 61 CKB
  protected _transaction: any // transaction
  protected _systemInfo: ISystemScript

  get value (): string {
    return this.helper.sumBy(this._outputs, 'value').toString()
  }

  get change (): string {
    return this.helper.sumBy(this._changes, 'value').toString()
  }

  get fee (): string {
    return this._fee.toString()
  }

  get waste (): string {
    return this._waste.toString()
  }

  get size (): string {
    return this.helper.countRawTransactionSize(this._transaction).toString()
  }

  get unspents (): IUTXOUnspent[] {
    return this._unspents
  }

  get inputs (): IUTXOInput[] {
    return this._inputs
  }

  get outputs (): IUTXOOutput[] {
    const changesNotEmpty = this.helper.filter(this._changes, (change): boolean => change.value.gt(0))
    return this._outputs.concat(changesNotEmpty)
  }

  get rawTransaction (): string {
    return this._toRawTransaction()
  }

  protected _toRawTransaction (): string {
    return this._transaction
  }

  /**
   * constructor
   *
   * @param {ISystemScript} systemInfo
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {IUTXOUnspent[]} unspents
   * @param {boolean} [autoFix=false]
   * @param {IKeypair[]} keypairs
   * @param {INetwork} network
   */
  async init (
    {
      systemInfo,
      froms,
      tos,
      unspents,
      changeAddress = null,
      autoFix = false,
      keypairs = [],
      network,
    }:
    {
      systemInfo: ISystemScript,
      froms: IUTXOFromToParam[],
      tos: IUTXOFromToParam[],
      unspents: IUTXOUnspent[],
      changeAddress?: string,
      autoFix?: boolean,
      keypairs?: IKeypair[],
      network: INetwork,
    }
  ): Promise<this> {
    this._systemInfo = systemInfo
    this._froms = froms.map((from: IUTXOFromToParam): IUTXOFrom => ({
      address: from.address,
    }))
    this._tos = tos.map((to: IUTXOFromToParam): IUTXOTo => ({
      address: to.address,
      value: new Decimal(to.value)
    }))
    this._changes = [
      {
        address: changeAddress ?? froms[0].address,
        value: new Decimal(0),
      },
    ]
    this._unspents = unspents
    this._autoFix = autoFix
    this._keypairs = keypairs
    this._network = network

    this._calcInputOutput()
    this._transaction = this._buildTransaction({ inputs: this.inputs, outputs: this.outputs })

    return this
  }

  /**
   * Edit transaction
   *
   * @param {Decimal.Value} [fee=null]
   * @param {Decimal.Value} [feeRate=null]
   * @param {IUTXOFromToParam[]} [tos=null]
   * @param {IKeypair[]} [keypairs=null]
   * @param {string[]} [memos=null]
   * @param {string} [changeAddress='']
   * @return {void}
   */
  edit (
    {
      fee = null,
      feeRate = null,
      tos = null,
      keypairs = null,
      memos = null,
      changeAddress = '',
    }:
    {
      fee?: Decimal.Value,
      feeRate?: Decimal.Value,
      tos?: IUTXOFromToParam[],
      keypairs?: IKeypair[],
      memos?: binStr[],
      changeAddress?: string,
    }
  ): void {
    if (this.helper.isArray(tos)) {
      this._tos = tos.map((to: IUTXOFromToParam): IUTXOTo => ({
        address: to.address,
        value: new Decimal(to.value)
      }))
    }
    if (this.helper.isArray(keypairs)) {
      this._keypairs = keypairs
    }
    if (changeAddress && this.helper.isValidAddress(changeAddress)) {
      this._changes[0].address = changeAddress
    }

    // the priority of fee params: fee > feeRate
    if (!this.helper.isNil(fee)) {
      this._fee = new Decimal(fee)
      this._waste = new Decimal(0)
      this._calcInputOutput()
    }
    else if (!this.helper.isNil(feeRate)) {
      feeRate = new Decimal(feeRate)

      // reset fee to 0 in order to reset status of inputs
      this._fee = new Decimal(0)
      this._waste = new Decimal(0)

      this._calcInputOutput()

      let i = 1
      while (true) {
        this.logger.debug(`Transaction.edit recalculating fee for ${i} time(s)`)

        const originalInputLength = this.inputs.length
        const originalOutputLength = this.outputs.length
        this._fee = this.transactionHelper.calcFee({
          feeRate,
          inputs: this.inputs,
          outputs: this.outputs,
          outputsData: [].fill('0x', 0, this.outputs.length - 1)
        })
        this._waste = new Decimal(0)
        this._calcInputOutput()
        if (this.inputs.length === originalInputLength && this.outputs.length === originalOutputLength) {
          this.logger.debug('Transaction.edit final fee has been calculated:', this._fee.toString())
          break
        }

        if (i >= 10) {
          this.logger.warn(`Transaction.edit recalculating fee reached max retries(${i}time(s)), force break.`)
          break
        }
        i++
      }
    }
    // always recalculate inputs and outputs in order to apply changes of tos
    else {
      this._calcInputOutput()
    }

    this._transaction = this._buildTransaction({ inputs: this.inputs, outputs: this.outputs })
  }

  toHex (): string {
    return helper.serializeRawTransaction(this._toRawTransaction())
  }

  toJSON (): any {
    return this._toRawTransaction()
  }

  protected _calcInputOutput (): void {
    const { inputs, outputs, changes, fee, waste } = this.transactionHelper.calcInputOutput({
      unspents: this._unspents,
      tos: this._tos,
      changes: this._changes,
      fee: this._fee ? this._fee.sub(this._waste) : new Decimal(0),
      autoFix: this._autoFix
    })
    this._inputs = inputs
    this._outputs = outputs
    this._changes = changes
    this._fee = fee
    this._waste = waste
  }

  /**
   * Build ckb-sdk-js transaction object
   *
   * @param {IUTXOInput[]} inputs
   * @param {IUTXOOutput[]} outputs
   * @return {RawTransaction}
   * @protected
   */
  protected _buildTransaction (
    { inputs, outputs }:
    { inputs: IUTXOInput[], outputs: IUTXOOutput[] }
  ): RPC.RawTransaction {
    this.logger.debug('Transaction._buildTransaction')

    const { codeHash, outPoint, hashType } = this._systemInfo
    const wallets = new Map<string, string>()

    const txInputs: IInput[] = inputs.map((input: IUTXOInput): IInput => {
      if (this?._keypairs.length > 0) {
        const keypair = this._keypairs.find((keypair: IKeypair): boolean => {
          return keypair.address === input.address
        })

        if (!keypair) {
          throw OneChainError.fromCode(117)
        }

        wallets.set(input.lockHash, keypair.privateKey)
      }

      return {
        previousOutput: {
          index: new Decimal(input.vout).toHex(),
          txHash: input.txId
        },
        since: '0x0',
        lock: input.lock,
        lockHash: input.lockHash,
        outPoint: {
          txHash: input.txId,
          index: new Decimal(input.vout).toHex()
        },
      }
    })

    const txOutputs: IOutput[] = outputs.map((output: IUTXOOutput): IOutput => {
      return {
        capacity: output.value.toHex(),
        type: null,
        lock: {
          args: LockUtils.addressToBlake160(output.address),
          codeHash,
          hashType,
        },
      }
    })

    // basic structure of transaction
    let tx: IRawTransaction = {
      version: '0x0',
      cellDeps: [
        {
          outPoint,
          depType: DepType.DepGroup,
        },
      ],
      headerDeps: [],
      inputs: txInputs,
      outputs: txOutputs,
      outputsData: txOutputs.map(output => output.data ?? '0x'),
      witnesses: txInputs.map(() => ({
        lock: '',
        inputType: '',
        outputType: ''
      })),
    }

    if (this?._keypairs.length > 0) {
      // It is awkward but here we must create a temporary Core instance in order to sign transaction
      // @ts-ignore
      tx = new Core().signTransaction(wallets)(tx, tx.inputs)
    }

    // rpc do not allow redundant fields
    tx.inputs.forEach((input: IInput) => {
      delete input.lock
      delete input.lockHash
      delete input.outPoint
    })

    // @ts-ignore
    return this.helper.toSnakeCaseTransaction(tx)
  }
}

export default Transaction
