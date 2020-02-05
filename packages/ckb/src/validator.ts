import { validator as coreValidator, ParamError } from '@onechain/core'

import { isValidAddress, isValidPrivateKey } from './helper'

type validateFn = coreValidator.validateFn

export const validator = coreValidator.validator.extend({
  'IKeypair': function (name: string, value: any): void {
    if (!value.address || !isValidAddress(value.address)) {
      throw ParamError.fromCode(200, name)
    }
    if (!value.privateKey || !isValidPrivateKey(value.privateKey)) {
      throw ParamError.fromCode(201, name)
    }
  },
  'IKeypair[]': function (name: string, value: any[], refer: validateFn): void {
    value.forEach((keypair, i: number): void => {
      refer('IKeypair', `${name}[${i}]`, keypair)
    })
  },
  'address': function (name: string, value: any): void {
    if (!value || !isValidAddress(value)) {
      throw ParamError.fromCode(202, name)
    }
  },
  'froms': function (name: string, value: any[], refer: validateFn): void {
    value.forEach((from, i: number): void => {
      refer('address', `${name}[${i}]`, from.address)
    })
  },
  'tos': function (name: string, value: any[], refer: validateFn): void {
    value.forEach((to, i: number): void => {
      refer('address', `${name}[${i}]`, to.address)
      refer('value', `${name}[${i}]`, to.value)
    })
  }
})

export const params = coreValidator.params(validator)
export const objParams = coreValidator.objParams(validator)
