import { IUTXOUnspent, IUTXOApiProvider, RPCNode } from '@onechain/core';
export declare class BlockABC implements IUTXOApiProvider {
    readonly logger: import("@onechain/core/types").Logger;
    readonly supportBatch = true;
    readonly rateLimit = 3;
    protected endpoint: string;
    constructor(rpcnode: RPCNode);
    ping(): Promise<number>;
    getTx(txId: string): Promise<any>;
    getAddresses(addresses: string[]): Promise<{
        address: string;
        txCount: number;
    }[]>;
    getUnspentOfAddresses(addresses: string[], onlyConfirmed?: boolean): Promise<IUTXOUnspent[]>;
    pushTransaction(rawTransaction: any): Promise<string>;
    protected buildUrl(path: string, query?: any): string;
    protected get(path: any, query?: any): Promise<any>;
    protected post(path: any, data: any, query?: any): Promise<any>;
}
export default BlockABC;
