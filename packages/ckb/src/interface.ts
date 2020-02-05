import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils'

import { ScriptHashType, DepType } from './const'

export interface INetwork {
  id: string,
  addressPrefix: AddressPrefix,
}

export interface ISystemScript {
  codeHash: string,
  outPoint: IOutPoint,
  hashType: ScriptHashType,
}

export interface ICellDep {
  outPoint: IOutPoint | null,
  depType: DepType,
}

export interface IWitnessObj {
  lock?: string,
  inputType?: string,
  outputType?: string,
}

export type IWitness = IWitnessObj | string

export interface IScript {
  args?: string,
  codeHash?: string | null,
  hashType: ScriptHashType,
}

export interface IOutPoint {
  txHash: string,
  index: string,
}

export interface IInput {
  // fields for debug
  capacity?: string | null,
  // fields for rpc
  previousOutput: IOutPoint | null,
  since?: string,
  // fields for signing
  lockHash?: string | null,
  lock?: IScript | null,
  outPoint?: IOutPoint,
}

export interface IOutput {
  capacity: string,
  type: IScript,
  lock: IScript,
  lockHash?: string,
  data?: string,
  outPoint?: IOutPoint,
  status?: string,
  typeHash?: string,
  daoData?: string,
  timestamp?: string,
  blockNumber?: string,
  blockHash?: string,
  depositIOutPoint?: IOutPoint,
  depositTimestamp?: string,
}

// about the transaction:
// cn https://mp.weixin.qq.com/s/_ecO_Ory2FVcyqnODTmMiQ
// en https://github.com/nervosnetwork/rfcs/blob/transaction-structure/rfcs/0022-transaction-structure/0022-transaction-structure.md
export interface IRawTransaction {
  version: string,
  cellDeps: ICellDep[],
  headerDeps: string[],
  inputs: IInput[],
  outputs: IOutput[],
  witnesses: IWitness[],
  outputsData: string[],
}
