import { INetwork } from './interface';
export declare const MIN_CELL_CAPACITY = "6100000000";
export declare const LENGTH_BYTE_SIZE = 4;
export declare const SERIALIZED_OFFSET_BYTESIZE = 4;
export declare const TX_SIZE: {
    version: number;
    cellDep: number;
    headerDep: number;
    input: number;
    outputTypeNull: number;
    outputDataEmpty: number;
    witnessTypeNull: number;
};
export declare const MAINNET: INetwork;
export declare const TESTNET: INetwork;
export declare enum ScriptHashType {
    Data = "data",
    Type = "type"
}
export declare enum DepType {
    Code = "code",
    DepGroup = "depGroup"
}
