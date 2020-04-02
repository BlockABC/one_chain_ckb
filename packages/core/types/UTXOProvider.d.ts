import { ILogger, IKeypair, IUTXOProvider, IUTXOTransaction, IUTXOFromToParam, binStr } from './interface';
import { RPCNode } from './RPCNode';
export declare abstract class UTXOProvider implements IUTXOProvider {
    readonly logger: ILogger;
    readonly helper: any;
    readonly name: string;
    protected _rpcnode: RPCNode;
    protected _keypairs: IKeypair[];
    get rpcnode(): RPCNode;
    get keypairs(): IKeypair[];
    init({ rpcnode, keypairs, logger }: {
        rpcnode: RPCNode;
        keypairs: IKeypair[];
        logger?: ILogger;
    }): this;
    abstract setRPCNode({ rpcnode }: {
        rpcnode: RPCNode;
    }): void;
    abstract setKeypairs({ keypairs }: {
        keypairs: IKeypair[];
    }): void;
    abstract buildTransaction({ froms, tos, memos, changeAddress }: {
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        memos?: binStr[];
        changeAddress?: string;
    }): Promise<IUTXOTransaction>;
    abstract buildAutoFixTransaction({ froms, tos, memos, changeAddress }: {
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        memos?: binStr[];
        changeAddress?: string;
    }): Promise<IUTXOTransaction>;
    abstract pushTransaction({ transaction }: {
        transaction: IUTXOTransaction | any;
    }): Promise<string>;
}
