/// <reference types="../types/rpc" />
import Core from '@nervosnetwork/ckb-sdk-core';
import { ILogger, IUTXOTransaction, IUTXOHDWallet, IUTXOFromToParam, IUTXOUnspent, IUTXOApiProvider, IKeypair, binStr, RPCNode, UTXOProvider } from '@onechain/core';
import { ISystemScript } from './interface';
import * as helper from './helper';
import { HDWallet } from './HDWallet';
import { Transaction } from './Transaction';
/**
 * CKB
 *
 * @export
 * @class CKB
 * @extends {UTXOProvider}
 */
export declare class CKB extends UTXOProvider {
    readonly logger: import("@onechain/core/types").Logger;
    readonly helper: typeof helper;
    readonly name = "CKB";
    protected _apiProvider: IUTXOApiProvider;
    protected _network: any;
    protected _core: Core;
    get network(): any;
    constructor({ rpcnode, keypairs, logger }: {
        rpcnode: RPCNode;
        keypairs?: IKeypair[];
        logger?: ILogger;
    });
    init({ rpcnode, keypairs, logger }: {
        rpcnode: RPCNode;
        keypairs?: IKeypair[];
        logger?: ILogger;
    }): this;
    setKeypairs({ keypairs }: {
        keypairs: IKeypair[];
    }): void;
    setRPCNode({ rpcnode }: {
        rpcnode: RPCNode;
    }): void;
    /**
     * Sign transaction
     *
     * @param {IRawTransaction} transaction
     * @param {IUTXOUnspent[]} unspents
     * @return {string}
     */
    sign({ transaction, unspents }: {
        transaction: RPC.RawTransaction;
        unspents: IUTXOUnspent[];
    }): any;
    /**
     * Build transaction
     *
     * @param {IUTXOFromToParam[]} froms
     * @param {IUTXOFromToParam[]} tos
     * @param {string} changeAddress
     * @param {binStr[]} [memos=[]]
     * @return {Promise<Transaction>}
     */
    buildTransaction({ froms, tos, changeAddress, memos }: {
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        changeAddress: string;
        memos?: binStr[];
    }): Promise<IUTXOTransaction>;
    /**
     * Build transaction with autofix
     *
     * @param {IUTXOFromToParam[]} froms
     * @param {IUTXOFromToParam[]} tos
     * @param {string} changeAddress
     * @param {binStr[]} [memos=[]]
     * @return {Promise<Transaction>}
     */
    buildAutoFixTransaction({ froms, tos, changeAddress, memos }: {
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        changeAddress: string;
        memos?: binStr[];
    }): Promise<IUTXOTransaction>;
    /**
     * Push transaction
     *
     * @param {IUTXOTransaction|string} transaction
     * @return {Promise<string>}
     */
    pushTransaction({ transaction }: {
        transaction: IUTXOTransaction | string;
    }): Promise<string>;
    /**
     * Create HD wallet from mnemonic
     *
     * @param {string} mnemonic
     * @param {string | string[]} path
     * @param {boolean} [needSync=true]
     * @return {Promise<HDWallet>}
     */
    hdwalletFromMnemonic({ mnemonic, path, needSync }: {
        mnemonic: string;
        path: string | string[];
        needSync?: boolean;
    }): Promise<IUTXOHDWallet>;
    /**
     * Create HD wallet from json
     *
     * @param {*} json
     * @return {Promise<HDWallet>}
     */
    hdwalletFromJSON({ json }: {
        json: any;
    }): Promise<IUTXOHDWallet>;
    protected _getApiProvider({ rpcnode }: {
        rpcnode: RPCNode;
    }): IUTXOApiProvider;
    protected _loadSystemInfo(): Promise<ISystemScript>;
    /**
     * Build transaction
     *
     * @param {IUTXOFromToParam[]} froms
     * @param {IUTXOFromToParam[]} tos
     * @param {string} changeAddress
     * @param {boolean} [autoFix=false]
     * @return {Promise<Transaction>}
     */
    _buildTransaction({ froms, tos, changeAddress, autoFix }: {
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        changeAddress: string;
        autoFix?: boolean;
    }): Promise<Transaction>;
    protected _buildHDWalletFromMnemonic({ mnemonic, path, needSync }: {
        mnemonic: string;
        path: string | string[];
        needSync?: boolean;
    }): Promise<HDWallet>;
    protected _buildHDWalletFromJSON(json: any): Promise<HDWallet>;
}
export default CKB;
