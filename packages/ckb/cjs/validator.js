"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@onechain/core");
const helper_1 = require("./helper");
exports.validator = core_1.validator.validator.extend({
    'IKeypair': function (name, value) {
        if (!value.address || !helper_1.isValidAddress(value.address)) {
            throw core_1.ParamError.fromCode(200, name);
        }
        if (!value.privateKey || !helper_1.isValidPrivateKey(value.privateKey)) {
            throw core_1.ParamError.fromCode(201, name);
        }
    },
    'IKeypair[]': function (name, value, refer) {
        value.forEach((keypair, i) => {
            refer('IKeypair', `${name}[${i}]`, keypair);
        });
    },
    'address': function (name, value) {
        if (!value || !helper_1.isValidAddress(value)) {
            throw core_1.ParamError.fromCode(202, name);
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
exports.params = core_1.validator.params(exports.validator);
exports.objParams = core_1.validator.objParams(exports.validator);
