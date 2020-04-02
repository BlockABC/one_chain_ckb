"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ckb_sdk_utils_1 = require("@nervosnetwork/ckb-sdk-utils");
exports.MIN_CELL_CAPACITY = '6100000000';
exports.LENGTH_BYTE_SIZE = 4;
exports.SERIALIZED_OFFSET_BYTESIZE = 4;
exports.TX_SIZE = {
    version: 4,
    cellDep: 37,
    headerDep: 32,
    input: exports.LENGTH_BYTE_SIZE + 40,
    outputTypeNull: 97,
    outputDataEmpty: 4,
    witnessTypeNull: exports.LENGTH_BYTE_SIZE + 85
};
exports.MAINNET = {
    id: 'mainnet',
    addressPrefix: ckb_sdk_utils_1.AddressPrefix.Mainnet
};
exports.TESTNET = {
    id: 'testnet',
    addressPrefix: ckb_sdk_utils_1.AddressPrefix.Testnet
};
var ScriptHashType;
(function (ScriptHashType) {
    ScriptHashType["Data"] = "data";
    ScriptHashType["Type"] = "type";
})(ScriptHashType = exports.ScriptHashType || (exports.ScriptHashType = {}));
var DepType;
(function (DepType) {
    DepType["Code"] = "code";
    DepType["DepGroup"] = "depGroup";
})(DepType = exports.DepType || (exports.DepType = {}));
