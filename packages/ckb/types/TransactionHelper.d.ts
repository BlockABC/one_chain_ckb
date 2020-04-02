import Decimal from 'decimal.js';
import { IUTXOFromToParam, IUTXOInput, IUTXOOutput, IUTXOUnspent } from '@onechain/core';
import * as helper from './helper';
export declare class TransactionHelper {
    readonly logger: import("@onechain/core/types").Logger;
    readonly helper: typeof helper;
    readonly minOutputValue = "6100000000";
    readonly txPartialSize: {
        version: number;
        cellDep: number;
        headerDep: number;
        input: number;
        outputTypeNull: number;
        outputDataEmpty: number;
        witnessTypeNull: number;
    };
    /**
     * Check if unspents is enough
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {Decimal} fee
     * @param {boolean} autoFix
     */
    isUnspentsEnough({ unspents, tos, fee, autoFix }: {
        unspents: IUTXOUnspent[];
        tos: IUTXOFromToParam[];
        fee: Decimal;
        autoFix: boolean;
    }): void;
    /**
     * Select unspents by order
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {IUTXOOutput[]} changes
     * @param {Decimal[]} [fee=new Decimal(0)]
     * @returns {{outputs: IUTXOOutput[]; inputs: any[]; changes: IUTXOOutput[]; fee: Decimal}}
     */
    selectUnspentsByOrder({ unspents, tos, changes, fee }: {
        unspents: IUTXOUnspent[];
        tos: IUTXOFromToParam[];
        changes: IUTXOOutput[];
        fee?: Decimal;
    }): {
        inputs: IUTXOInput[];
        outputs: IUTXOOutput[];
        changes: IUTXOOutput[];
        fee: Decimal;
        waste: Decimal;
    };
    /**
     * Select unspents by order and automatically fix
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {IUTXOOutput[]} changes
     * @param {Decimal[]} [fee=new Decimal(0)]
     * @returns {{outputs: IUTXOOutput[]; inputs: any[]; changes: IUTXOOutput[]; fee: Decimal}}
     */
    selectUnspentsByAutofix({ unspents, tos, changes, fee }: {
        unspents: IUTXOUnspent[];
        tos: IUTXOFromToParam[];
        changes: IUTXOOutput[];
        fee?: Decimal;
    }): {
        inputs: IUTXOInput[];
        outputs: IUTXOOutput[];
        changes: IUTXOOutput[];
        fee: Decimal;
        waste: Decimal;
    };
    /**
     * Calculate inputs and outputs
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {IUTXOOutput[]} changes
     * @param {Decimal} [fee=0]
     * @param {boolean} [autoFix=false]
     * @return {void}
     * @protected
     */
    calcInputOutput({ unspents, tos, changes, fee, autoFix }: {
        unspents: IUTXOUnspent[];
        tos: IUTXOFromToParam[];
        changes: IUTXOOutput[];
        fee?: Decimal;
        autoFix?: boolean;
    }): {
        inputs: IUTXOInput[];
        outputs: IUTXOOutput[];
        changes: IUTXOOutput[];
        fee: Decimal;
        waste: Decimal;
    };
    /**
     * Calculate transaction fee
     *
     * @param {number} inputCount
     * @param {any[]} inputs
     * @param {any[]} outputs
     * @param {any[]} outputsData
     * @param {Decimal.Value} feeRate
     * @return {number}
     * @protected
     */
    calcFee({ cellDepCount, headerDepCount, inputs, outputs, outputsData, feeRate, }: {
        cellDepCount?: number;
        headerDepCount?: number;
        inputs: IUTXOInput[];
        outputs: IUTXOOutput[];
        outputsData?: any[];
        feeRate: Decimal.Value;
    }): Decimal;
    estimateSize({ cellDepCount, headerDepCount, inputs, outputs, outputsData, }: {
        cellDepCount?: number;
        headerDepCount?: number;
        inputs: any[];
        outputs: any[];
        outputsData?: any[];
    }): number;
}
export declare const transactionHelper: TransactionHelper;
