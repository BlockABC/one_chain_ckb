import { CustomError } from 'ts-custom-error';
export { CustomError };
export declare class OneChainError extends CustomError {
    protected static messages: {
        1: string;
        10: string;
        11: string;
        12: string;
        13: string;
        14: string;
        15: string;
        16: string;
        20: string;
        21: string;
        22: string;
        23: string;
        24: string;
        25: string;
        80: string;
        96: string;
        97: string;
        98: string;
        99: string;
        100: string;
        101: string;
        102: string;
        103: string;
        104: string;
        105: string;
        106: string;
        107: string;
        108: string;
        109: string;
        110: string;
        111: string;
        112: string;
        113: string;
        114: string;
        115: string;
        116: string;
        117: string;
        118: string;
        119: string;
        120: string;
        121: string;
        122: string;
        123: string;
        124: string;
    };
    name: string;
    code: number;
    constructor(code: number, message: string);
    static fromCode(code: number, message?: any): OneChainError;
}
export declare class ParamError extends CustomError {
    protected static messages: {
        100: string;
        101: string;
        102: string;
        200: string;
        201: string;
        202: string;
        300: string;
        301: string;
    };
    name: string;
    code: number;
    constructor(code: number, message: any);
    static fromCode(code: number, paramName: string): ParamError;
}
export declare class RPCError extends CustomError {
    name: string;
    code: number;
    data: any;
    constructor(code: number, message: string, data?: any);
}
export declare class NetworkError extends CustomError {
    protected static messages: {
        1: string;
        2: string;
        3: string;
    };
    name: string;
    code: number;
    data: any;
    constructor(code: number, message: string, data?: any);
    static fromCode(code: number, message: string, data?: any): NetworkError;
}
