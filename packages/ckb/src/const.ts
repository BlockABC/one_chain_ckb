import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils'

import { INetwork } from './interface'

export const MIN_CELL_CAPACITY = '6100000000'

export const LENGTH_BYTE_SIZE = 4
export const SERIALIZED_OFFSET_BYTESIZE = 4

export const TX_SIZE = {
  version: 4,
  cellDep: 37,
  headerDep: 32,
  input: LENGTH_BYTE_SIZE + 40,
  outputTypeNull: 97,
  outputDataEmpty: 4,
  witnessTypeNull: LENGTH_BYTE_SIZE + 85
}

export const MAINNET: INetwork = {
  id: 'mainnet',
  addressPrefix: AddressPrefix.Mainnet
}

export const TESTNET: INetwork = {
  id: 'testnet',
  addressPrefix: AddressPrefix.Testnet
}

export enum ScriptHashType {
  Data = 'data',
  Type = 'type',
}

export enum DepType {
  Code = 'code',
  DepGroup = 'depGroup',
}
