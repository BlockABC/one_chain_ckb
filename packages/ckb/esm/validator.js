import { validator as coreValidator, ParamError } from '@onechain/core';
import { isValidAddress, isValidPrivateKey } from './helper';
export const validator = coreValidator.validator.extend({
    'IKeypair': function (name, value) {
        if (!value.address || !isValidAddress(value.address)) {
            throw ParamError.fromCode(200, name);
        }
        if (!value.privateKey || !isValidPrivateKey(value.privateKey)) {
            throw ParamError.fromCode(201, name);
        }
    },
    'IKeypair[]': function (name, value, refer) {
        value.forEach((keypair, i) => {
            refer('IKeypair', `${name}[${i}]`, keypair);
        });
    },
    'address': function (name, value) {
        if (!value || !isValidAddress(value)) {
            throw ParamError.fromCode(202, name);
        }
    },
    'froms': function (name, value, refer) {
        value.forEach((from, i) => {
            refer('address', `${name}[${i}]`, from.address);
        });
    },
    'tos': function (name, value, refer) {
        value.forEach((to, i) => {
            refer('address', `${name}[${i}]`, to.address);
            refer('value', `${name}[${i}]`, to.value);
        });
    }
});
export const params = coreValidator.params(validator);
export const objParams = coreValidator.objParams(validator);
