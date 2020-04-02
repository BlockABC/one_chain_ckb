import { IRPCNode } from './interface';
import { ChainType, NetworkProtocol } from './const';
export declare class RPCNode {
    chainId: string;
    chainType: ChainType;
    baseUrl?: string;
    protocol?: NetworkProtocol;
    host?: string;
    port?: number;
    constructor(rpcnode: IRPCNode);
    toString(): string;
}
export default RPCNode;
