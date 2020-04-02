/// <reference types="../types/rpc" />
import Decimal from 'decimal.js';
import { IUTXOTransaction, IUTXOFromToParam, IUTXOTo, IUTXOFrom, IUTXOUnspent, IUTXOInput, IUTXOOutput, IKeypair, binStr } from '@onechain/core';
import { ISystemScript, INetwork } from './interface';
import * as helper from './helper';
/**
 * Transaction
 *
 * @export
 * @class Transaction
 * @implements {IUTXOTransaction}
 */
export declare class Transaction implements IUTXOTransaction {
    readonly logger: import("@onechain/core/types").Logger;
    readonly helper: typeof helper;
    readonly transactionHelper: import("./TransactionHelper").TransactionHelper;
    protected _keypairs: IKeypair[];
    protected _network: any;
    protected _froms: IUTXOFrom[];
    protected _tos: IUTXOTo[];
    /**
     * It is hard to calculate output value correctlly from outside, because fee is unknown before transaction is created.
     * This will automatically fix output value so that user do not need to take care of fee any more.
     */
    protected _autoFix: boolean;
    protected _unspents: IUTXOUnspent[];
    protected _inputs: IUTXOInput[];
    protected _outputs: IUTXOOutput[];
    protected _changes: IUTXOOutput[];
    protected _value: Decimal;
    protected _fee: Decimal;
    protected _waste: Decimal;
    protected _transaction: any;
    protected _systemInfo: ISystemScript;
    get value(): string;
    get change(): string;
    get fee(): string;
    get waste(): string;
    get size(): string;
    get unspents(): IUTXOUnspent[];
    get inputs(): IUTXOInput[];
    get outputs(): IUTXOOutput[];
    get rawTransaction(): string;
    protected _toRawTransaction(): string;
    /**
     * constructor
     *
     * @param {ISystemScript} systemInfo
     * @param {IUTXOFromToParam[]} froms
     * @param {IUTXOFromToParam[]} tos
     * @param {string} changeAddress
     * @param {IUTXOUnspent[]} unspents
     * @param {boolean} [autoFix=false]
     * @param {IKeypair[]} keypairs
     * @param {INetwork} network
     */
    init({ systemInfo, froms, tos, unspents, changeAddress, autoFix, keypairs, network, }: {
        systemInfo: ISystemScript;
        froms: IUTXOFromToParam[];
        tos: IUTXOFromToParam[];
        unspents: IUTXOUnspent[];
        changeAddress?: string;
        autoFix?: boolean;
        keypairs?: IKeypair[];
        network: INetwork;
    }): Promise<this>;
    /**
     * Edit transaction
     *
     * @param {Decimal.Value} [fee=null]
     * @param {Decimal.Value} [feeRate=null]
     * @param {IUTXOFromToParam[]} [tos=null]
     * @param {IKeypair[]} [keypairs=null]
     * @param {string[]} [memos=null]
     * @param {string} [changeAddress='']
     * @return {void}
     */
    edit({ fee, feeRate, tos, keypairs, memos, changeAddress, }: {
        fee?: Decimal.Value;
        feeRate?: Decimal.Value;
        tos?: IUTXOFromToParam[];
        keypairs?: IKeypair[];
        memos?: binStr[];
        changeAddress?: string;
    }): void;
    toHex(): string;
    toJSON(): any;
    protected _calcInputOutput(): void;
    /**
     * Build ckb-sdk-js transaction object
     *
     * @param {IUTXOInput[]} inputs
     * @param {IUTXOOutput[]} outputs
     * @return {RawTransaction}
     * @protected
     */
    protected _buildTransaction({ inputs, outputs }: {
        inputs: IUTXOInput[];
        outputs: IUTXOOutput[];
    }): RPC.RawTransaction;
}
export default Transaction;
