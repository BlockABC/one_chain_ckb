import Decimal from 'decimal.js'

import { ChainType, NetworkProtocol, Level } from './const'
import { RPCNode } from './RPCNode'

// available input for BN.js, biginteger, bignumber.js
export type bigNumber = string | number

// binStr support utf8 string, hex string and Buffer
export type binStr = string | Buffer

export interface IRPCNode {
  chainId: string,
  chainType: ChainType,
  baseUrl?: string,
  protocol?: NetworkProtocol,
  host?: string,
  port?: number,
}

export interface IKeypair {
  privateKey: string,
  publicKey?: string,
  address?: string,
  wif?: string,
}

export interface ILogger {
  setLevel({ level }: { level: string | Level }): void,
  trace(message: any, ...args: any[]): void,
  debug(message: any, ...args: any[]): void,
  info(message: any, ...args: any[]): void,
  warn(message: any, ...args: any[]): void,
  error(message: any, ...args: any[]): void,
  fatal?(message: any, ...args: any[]): void,
}

export interface IUTXOProvider {
  readonly logger: ILogger,
  readonly helper: any,
  readonly name: string,
  readonly rpcnode: RPCNode,
  readonly keypairs: IKeypair[],

  /**
   * Init
   *
   * @param name
   * @param rpcnode
   * @param keypairs
   * @param logger
   */
  init (
    { name, rpcnode, keypairs, logger }:
    { name: string, rpcnode: RPCNode, keypairs: IKeypair[], logger?: ILogger }
  ): this,

  /**
   * Set RPC Node
   *
   * @param {RPCNode} rpcnode
   */
  setRPCNode({ rpcnode }: { rpcnode: RPCNode }): void,

  /**
   * Set keypairs for signing
   *
   * @param {IKeypair[]} keypairs
   */
  setKeypairs({ keypairs }: { keypairs: IKeypair[] }): void,

  /**
   * Build transaction
   *
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {string[]} memos
   * @return {Promise<IUTXOTransaction>}
   */
  buildTransaction (
    { froms, tos, changeAddress, memos }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], changeAddress: string, memos?: binStr[] }
  ): Promise<IUTXOTransaction>,

  /**
   * Build transaction with autofix
   *
   * @param {IUTXOFromToParam[]} froms
   * @param {IUTXOFromToParam[]} tos
   * @param {string} changeAddress
   * @param {binStr[]} [memos=[]]
   * @return {Promise<IUTXOTransaction>}
   */
  buildAutoFixTransaction (
    { froms, tos, changeAddress, memos }:
    { froms: IUTXOFromToParam[], tos: IUTXOFromToParam[], changeAddress: string, memos?: binStr[] }
  ): Promise<IUTXOTransaction>,

  /**
   * Push transaction
   *
   * @param {IUTXOTransaction | any} transaction
   * @return {Promise<string>}
   */
  pushTransaction ({ transaction }: { transaction: IUTXOTransaction | any }): Promise<string>,
}

export interface IUTXOTransaction {
  readonly value: string,
  readonly change: string,
  readonly fee: string,
  readonly waste: string,
  readonly size: string,
  readonly inputs: IUTXOInput[],
  readonly outputs: IUTXOOutput[],
  readonly rawTransaction: any,

  edit (params: {
    fee?: Decimal.Value,
    feeRate?: Decimal.Value,
    tos?: IUTXOFromToParam[],
    memos?: string[],
    keypairs?: IKeypair[],
    changeAddress?: string,
  }): void,
}

export interface IHDWalletAddress {
  address: string,
  balance: string,
  ecpair: any,
  index: number,
  txCount: number,
}

export interface IUTXOHDWallet {
  mnemonic: string,
  path: string,
  receiving: IHDWalletAddress[],
  change: IHDWalletAddress[],

  getKeypairs ({ type }: { type?: string }): IKeypair[],
  toJSON (): any,
}

export interface IUTXOApiProvider {
  // is batch request is supported
  readonly supportBatch: boolean,
  // request rate limit
  readonly rateLimit: number,

  /**
   * ping API server
   */
  ping (),

  /**
   * Batch request addresses' info
   *
   * @param {string[]} addresses
   * @returns {Promise<any[]>}
   */
  getAddresses (addresses: string[]): Promise<any[]>,

  /**
   * Batch request unspents of addresses
   *
   * @param {string[]} addresses
   * @param {boolean} [onlyConfirmed]
   * @returns {Promise<IUTXOUnspent[]>}
   */
  getUnspentOfAddresses (addresses: string[], onlyConfirmed?: boolean): Promise<IUTXOUnspent[]>,

  /**
   * Push transaction
   *
   * @param {string} rawTransaction
   * @returns {Promise<string>}
   */
  pushTransaction (rawTransaction: any): Promise<string>,
}

export interface IUTXOFromToParam {
  address: string,
  value?: Decimal.Value,
}

export interface IUTXOFrom {
  address: string,
}

export interface IUTXOTo {
  address: string,
  value: Decimal,
}

export interface IUTXOUnspent {
  txId: string,
  address: string,
  vout: number,
  value: Decimal.Value,
  lock?: any,
  lockHash?: string,
}

export type IUTXOInput = IUTXOUnspent

export interface IUTXOOutput {
  address: string,
  value: Decimal,
  type?: string,
  asm?: string,
}
