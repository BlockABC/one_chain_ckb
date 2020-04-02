/// <reference types="node" />
import { BIP32Interface as BIP32 } from 'bip32';
import { IKeypair, IUTXOApiProvider, RPCNode } from '@onechain/core';
import * as helper from './helper';
export interface IAddress {
    address: string;
    balance: string;
    ecpair: any;
    index: number;
    txCount: number;
}
export interface IAddressJSON {
    address: string;
    balance: string;
    index: number;
    privateKey: string;
    publicKey: string;
    txCount: number;
    wif: string;
}
/**
 * HDWallet
 *
 * @export
 * @class HDWallet
 */
export declare class HDWallet {
    static ADDRESS_ALL: string;
    static ADDRESS_CHANGE: string;
    static ADDRESS_RECEIVING: string;
    readonly logger: import("@onechain/core/types").Logger;
    readonly helper: typeof helper;
    protected _apiProvider: IUTXOApiProvider;
    protected _batchSize: number;
    protected _gapLimit: number;
    protected _mnemonic: string;
    protected _network: any;
    protected _path: string;
    protected _change: IAddress[];
    protected _receiving: IAddress[];
    protected _root: BIP32;
    protected _rpcnode: RPCNode;
    get mnemonic(): string;
    get path(): string;
    get receiving(): IAddress[];
    get change(): IAddress[];
    init({ mnemonic, path, rpcnode, apiProvider }: {
        mnemonic: string;
        path: string | string[];
        rpcnode: RPCNode;
        apiProvider: IUTXOApiProvider;
    }): Promise<this>;
    /**
     * Create HD wallet from JSON
     *
     * @static
     * @param {any} data
     * @param {RPCNode} rpcnode
     * @param {IUTXOApiProvider} apiProvider
     * @return {Promise<HDWallet>}
     */
    static fromJSON({ data, rpcnode, apiProvider }: {
        data: any;
        rpcnode: RPCNode;
        apiProvider: IUTXOApiProvider;
    }): Promise<HDWallet>;
    /**
     * Create HD wallet from mnemonic
     *
     * @static
     * @param {string} mnemonic
     * @param {string|string[]} path
     * @param {RPCNode} rpcnode
     * @param {IUTXOApiProvider} apiProvider
     * @param {boolean} [needSync=true]
     * @param {boolean} [syncFromStart=false]
     * @return {Promise<HDWallet>}
     */
    static fromMnemonic({ mnemonic, path, rpcnode, apiProvider, needSync, syncfromStart }: {
        mnemonic: string;
        path: string | string[];
        rpcnode: RPCNode;
        apiProvider: IUTXOApiProvider;
        needSync?: boolean;
        syncfromStart?: boolean;
    }): Promise<HDWallet>;
    /**
     * Get all keypairs in HD wallet
     *
     * @param {string} [type=HDWallet.ADDRESS_ALL]
     * @return {IKeypair[]}
     */
    getKeypairs({ type }?: {
        type?: string;
    }): IKeypair[];
    /**
     * Initialize HDWallet
     *
     * @param {string|string[]} path
     * @param {boolean} needSync
     * @param {boolean} syncfromStart
     * @return Promise<void>
     */
    derive({ needSync, syncfromStart }: {
        needSync?: boolean;
        syncfromStart?: boolean;
    }): Promise<void>;
    /**
     * Recover status HD wallet from data
     *
     * @param {IAddressJSON[]} receiving
     * @param {IAddressJSON[]} change
     * @return void
     */
    recover({ receiving, change }: {
        receiving: IAddressJSON[];
        change: IAddressJSON[];
    }): void;
    toJSON(): any;
    /**
     * Batch fetch addresses' information
     *
     * @protected
     * @param {BIP32} parent
     * @param {number} index
     * @param {number} gap
     * @param {IAddress[]} [fetchedAddress=[]]
     * @return {Promise<IAddress[]>}
     */
    protected _batchFetchAddresses(parent: BIP32, index: number, gap: number, fetchedAddress?: IAddress[]): Promise<IAddress[]>;
    /**
     * Calculate where the fetch start
     *
     * @protected
     * @param {string} path
     * @param {string} isChange
     * @param {IAddress[]} addresses
     * @param {boolean} [syncfromStart=false]
     * @return {node: BIP32Interface, gap: number, startAt: number}
     */
    protected _calcFetchStart(path: string, isChange: string, addresses: IAddress[], syncfromStart?: boolean): any;
    /**
     * Derive 20 addresses
     *
     * @protected
     * @param {string} path
     * @param {string} isChange
     * @return {any[]}
     */
    protected _derive(path: string, isChange: string): any[];
    /**
     * Discover addresses through rpc
     *
     * @protected
     * @param {string|string[]} path
     * @param {string} isChange
     * @param {boolean} [syncfromStart=false]
     * @return {Promise<IAddress[]>}
     */
    protected _discover(path: string, isChange: string, syncfromStart?: boolean): Promise<IAddress[]>;
    /**
     * Find used path
     *
     * @param path
     * @returns {Promise<string>}
     * @protected
     */
    protected _findUsedPath({ path }: {
        path: string[];
    }): Promise<string>;
    protected _getEcpairFromWIF(wif: string): IKeypair;
    protected _getEcpairFromPrivateKey(privateKey: Buffer): IKeypair;
    protected _getPublicKeyFromAddress(address: IAddress): string;
    protected _getPrivateKeyFromAddress(address: IAddress): string;
    protected _getWIFFromAddress(address: IAddress): string;
    protected _getAddressFromEcpair(keypair: IKeypair): string;
}
export default HDWallet;
