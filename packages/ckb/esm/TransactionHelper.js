import Decimal from 'decimal.js';
import { OneChainError } from '@onechain/core';
import { logger } from './log';
import * as helper from './helper';
import { MIN_CELL_CAPACITY, LENGTH_BYTE_SIZE, SERIALIZED_OFFSET_BYTESIZE, TX_SIZE } from './const';
export class TransactionHelper {
    constructor() {
        this.logger = logger;
        this.helper = helper;
        this.minOutputValue = MIN_CELL_CAPACITY;
        this.txPartialSize = TX_SIZE;
    }
    /**
     * Check if unspents is enough
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {Decimal} fee
     * @param {boolean} autoFix
     */
    isUnspentsEnough({ unspents, tos, fee, autoFix }) {
        const availableValue = helper.sumBy(unspents, 'value');
        const requiredValue = helper.sumBy(tos, 'value');
        if (availableValue.lte(0)) {
            this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance, balance is ${availableValue}`);
            throw OneChainError.fromCode(102);
        }
        if (availableValue.lte(fee)) {
            this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) + fee(${fee}) > balance(${availableValue})`);
            throw OneChainError.fromCode(109);
        }
        if (!autoFix) {
            if (requiredValue.gt(availableValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) > balance(${availableValue})`);
                throw OneChainError.fromCode(116);
            }
            else if (requiredValue.add(fee).gt(availableValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) + fee(${fee}) > balance(${availableValue})`);
                throw OneChainError.fromCode(109);
            }
        }
        else {
            if (availableValue.sub(fee).lt(this.minOutputValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: balance(${availableValue}) - fee(${fee}) < ${this.minOutputValue} `);
                throw OneChainError.fromCode(109);
            }
        }
    }
    /**
     * Select unspents by order
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {IUTXOOutput[]} changes
     * @param {Decimal[]} [fee=new Decimal(0)]
     * @returns {{outputs: IUTXOOutput[]; inputs: any[]; changes: IUTXOOutput[]; fee: Decimal}}
     */
    selectUnspentsByOrder({ unspents, tos, changes, fee = new Decimal(0) }) {
        const outputValue = helper.sumBy(tos, 'value').add(fee);
        let inputValue = new Decimal(0);
        let waste = new Decimal(0);
        const inputs = [];
        for (const unspent of unspents) {
            unspent.value = new Decimal(unspent.value);
            inputs.push(unspent);
            inputValue = inputValue.add(unspent.value);
            if (inputValue.equals(outputValue)) {
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByOrder stop finding more unspents: input(${inputValue.toString()}) = output(${outputValue.toString()})`);
                break;
            }
            else if (inputValue.gt(outputValue.add(this.minOutputValue))) {
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByOrder stop finding more unspents: input(${inputValue.toString()}) > output(${outputValue.toString()}) + minOutputValue(${this.minOutputValue})`);
                break;
            }
        }
        const outputs = tos.map((to) => {
            return {
                address: to.address,
                value: to.value,
            };
        });
        const changeValue = inputValue.sub(outputValue);
        if (changeValue.gte(this.minOutputValue)) {
            changes[0].value = changeValue;
        }
        else {
            fee = fee.add(changeValue);
            changes[0].value = new Decimal(0);
            waste = changeValue;
            this.logger.debug(`UTXOTransactionHelper.selectUnspentsByOrder waste changes: ${waste.toString()}`);
        }
        return { inputs, outputs, changes, fee, waste };
    }
    /**
     * Select unspents by order and automatically fix
     *
     * @param {IUTXOUnspent[]} unspents
     * @param {IUTXOFromToParam[]} tos
     * @param {IUTXOOutput[]} changes
     * @param {Decimal[]} [fee=new Decimal(0)]
     * @returns {{outputs: IUTXOOutput[]; inputs: any[]; changes: IUTXOOutput[]; fee: Decimal}}
     */
    selectUnspentsByAutofix({ unspents, tos, changes, fee = new Decimal(0) }) {
        let outputValue = helper.sumBy(tos, 'value').add(fee);
        let inputValue = new Decimal(0);
        let waste = new Decimal(0);
        const inputs = [];
        for (const unspent of unspents) {
            unspent.value = new Decimal(unspent.value);
            inputs.push(unspent);
            inputValue = inputValue.add(unspent.value);
            if (inputValue.equals(outputValue)) {
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix stop finding more unspents: input(${inputValue.toString()}) = output(${outputValue.toString()})`);
                break;
            }
            else if (inputValue.gt(outputValue.add(this.minOutputValue))) {
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix stop finding more unspents: input(${inputValue.toString()}) > output(${outputValue.toString()}) + minOutputValue(${this.minOutputValue})`);
                break;
            }
        }
        let outputs;
        if (inputValue.gt(outputValue)) {
            outputs = tos.map((to) => {
                return {
                    address: to.address,
                    value: to.value,
                };
            });
            const changeValue = inputValue.sub(outputValue);
            if (changeValue.gte(this.minOutputValue)) {
                changes[0].value = changeValue;
            }
            else {
                fee = fee.add(changeValue);
                changes[0].value = new Decimal(0);
                waste = changeValue;
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix waste changes: ${waste.toString()}`);
            }
        }
        else {
            const marginValue = outputValue.sub(inputValue);
            if (!(tos[0].value instanceof Decimal) || !Decimal.isDecimal(tos[0].value)) {
                tos[0].value = new Decimal(tos[0].value);
            }
            const fixedValue = tos[0].value.sub(marginValue);
            this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix fix tos: tos(${tos[0].value.toString()}) - margin(${marginValue.toString()}) = fixed(${fixedValue.toString()})`);
            outputs = [
                {
                    address: tos[0].address,
                    value: fixedValue,
                }
            ];
            changes[0].value = new Decimal(0);
            outputValue = helper.sumBy(outputs, 'value').add(fee);
            if (inputValue.sub(outputValue).gt(0)) {
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix fee increase to ${fee.toString()}`);
                fee = fee.add(inputValue.sub(outputValue));
            }
        }
        return { inputs, outputs, changes, fee, waste };
    }
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
    calcInputOutput({ unspents, tos, changes, fee = new Decimal(0), autoFix = false }) {
        this.logger.info('UTXOTransactionHelper.calcInputOutput calculating inputs and outputs group.');
        this.isUnspentsEnough({ unspents, tos, fee, autoFix });
        unspents = helper.cloneDeep(unspents);
        tos = helper.cloneDeep(tos);
        changes = helper.cloneDeep(changes);
        let selected;
        if (autoFix) {
            this.logger.debug('UTXOTransactionHelper.calcInputOutput: select unspents by auto fix.');
            selected = this.selectUnspentsByAutofix({ unspents, tos, changes, fee });
        }
        else {
            this.logger.debug('UTXOTransactionHelper.calcInputOutput: select unspents by order.');
            selected = this.selectUnspentsByOrder({ unspents, tos, changes, fee });
        }
        return selected;
    }
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
    calcFee({ cellDepCount = 1, headerDepCount = 0, inputs, outputs, outputsData = null, feeRate, }) {
        logger.info('calcFee: calculating transaction fee.');
        if (!(feeRate instanceof Decimal) || !Decimal.isDecimal(feeRate)) {
            feeRate = new Decimal(feeRate);
        }
        if (feeRate.lt(1.1)) {
            feeRate = new Decimal(1.1);
        }
        const size = this.estimateSize({
            cellDepCount,
            headerDepCount,
            inputs,
            outputs,
            outputsData,
        });
        logger.trace('calcFee: estimated transaction size:', size);
        return Decimal.ceil(feeRate.times(size));
    }
    estimateSize({ cellDepCount = 1, headerDepCount = 0, inputs, outputs, outputsData = null, }) {
        if (this.helper.isNil(outputsData)) {
            outputsData = [].fill('0x', 0, outputs.length - 1);
        }
        const size = (LENGTH_BYTE_SIZE + SERIALIZED_OFFSET_BYTESIZE * 6 +
            this.txPartialSize.version +
            (LENGTH_BYTE_SIZE + cellDepCount * this.txPartialSize.cellDep) +
            (LENGTH_BYTE_SIZE + headerDepCount * this.txPartialSize.headerDep) +
            (LENGTH_BYTE_SIZE + inputs.length * this.txPartialSize.input) +
            (LENGTH_BYTE_SIZE + outputs.length * SERIALIZED_OFFSET_BYTESIZE + outputs.length * this.txPartialSize.outputTypeNull) +
            (LENGTH_BYTE_SIZE + outputsData.length * SERIALIZED_OFFSET_BYTESIZE + outputsData.length * this.txPartialSize.outputDataEmpty)) +
            (LENGTH_BYTE_SIZE + inputs.length * SERIALIZED_OFFSET_BYTESIZE + inputs.length * this.txPartialSize.witnessTypeNull);
        return size;
    }
}
export const transactionHelper = new TransactionHelper();
