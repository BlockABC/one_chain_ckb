import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils';
export const MIN_CELL_CAPACITY = '6100000000';
export const LENGTH_BYTE_SIZE = 4;
export const SERIALIZED_OFFSET_BYTESIZE = 4;
export const TX_SIZE = {
    version: 4,
    cellDep: 37,
    headerDep: 32,
    input: LENGTH_BYTE_SIZE + 40,
    outputTypeNull: 97,
    outputDataEmpty: 4,
    witnessTypeNull: LENGTH_BYTE_SIZE + 85
};
export const MAINNET = {
    id: 'mainnet',
    addressPrefix: AddressPrefix.Mainnet
};
export const TESTNET = {
    id: 'testnet',
    addressPrefix: AddressPrefix.Testnet
};
export var ScriptHashType;
(function (ScriptHashType) {
    ScriptHashType["Data"] = "data";
    ScriptHashType["Type"] = "type";
})(ScriptHashType || (ScriptHashType = {}));
export var DepType;
(function (DepType) {
    DepType["Code"] = "code";
    DepType["DepGroup"] = "depGroup";
})(DepType || (DepType = {}));
