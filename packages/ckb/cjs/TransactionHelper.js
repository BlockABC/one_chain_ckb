"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const core_1 = require("@onechain/core");
const log_1 = require("./log");
const helper = __importStar(require("./helper"));
const const_1 = require("./const");
class TransactionHelper {
    constructor() {
        this.logger = log_1.logger;
        this.helper = helper;
        this.minOutputValue = const_1.MIN_CELL_CAPACITY;
        this.txPartialSize = const_1.TX_SIZE;
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
            throw core_1.OneChainError.fromCode(102);
        }
        if (availableValue.lte(fee)) {
            this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) + fee(${fee}) > balance(${availableValue})`);
            throw core_1.OneChainError.fromCode(109);
        }
        if (!autoFix) {
            if (requiredValue.gt(availableValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) > balance(${availableValue})`);
                throw core_1.OneChainError.fromCode(116);
            }
            else if (requiredValue.add(fee).gt(availableValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: to(${requiredValue}) + fee(${fee}) > balance(${availableValue})`);
                throw core_1.OneChainError.fromCode(109);
            }
        }
        else {
            if (availableValue.sub(fee).lt(this.minOutputValue)) {
                this.logger.error(`UTXOTransactionHelper.isUnspentsEnough insufficient balance: balance(${availableValue}) - fee(${fee}) < ${this.minOutputValue} `);
                throw core_1.OneChainError.fromCode(109);
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
    selectUnspentsByOrder({ unspents, tos, changes, fee = new decimal_js_1.default(0) }) {
        const outputValue = helper.sumBy(tos, 'value').add(fee);
        let inputValue = new decimal_js_1.default(0);
        let waste = new decimal_js_1.default(0);
        const inputs = [];
        for (const unspent of unspents) {
            unspent.value = new decimal_js_1.default(unspent.value);
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
            changes[0].value = new decimal_js_1.default(0);
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
    selectUnspentsByAutofix({ unspents, tos, changes, fee = new decimal_js_1.default(0) }) {
        let outputValue = helper.sumBy(tos, 'value').add(fee);
        let inputValue = new decimal_js_1.default(0);
        let waste = new decimal_js_1.default(0);
        const inputs = [];
        for (const unspent of unspents) {
            unspent.value = new decimal_js_1.default(unspent.value);
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
                changes[0].value = new decimal_js_1.default(0);
                waste = changeValue;
                this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix waste changes: ${waste.toString()}`);
            }
        }
        else {
            const marginValue = outputValue.sub(inputValue);
            if (!(tos[0].value instanceof decimal_js_1.default) || !decimal_js_1.default.isDecimal(tos[0].value)) {
                tos[0].value = new decimal_js_1.default(tos[0].value);
            }
            const fixedValue = tos[0].value.sub(marginValue);
            this.logger.debug(`UTXOTransactionHelper.selectUnspentsByAutofix fix tos: tos(${tos[0].value.toString()}) - margin(${marginValue.toString()}) = fixed(${fixedValue.toString()})`);
            outputs = [
                {
                    address: tos[0].address,
                    value: fixedValue,
                }
            ];
            changes[0].value = new decimal_js_1.default(0);
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
    calcInputOutput({ unspents, tos, changes, fee = new decimal_js_1.default(0), autoFix = false }) {
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
        log_1.logger.info('calcFee: calculating transaction fee.');
        if (!(feeRate instanceof decimal_js_1.default) || !decimal_js_1.default.isDecimal(feeRate)) {
            feeRate = new decimal_js_1.default(feeRate);
        }
        if (feeRate.lt(1.1)) {
            feeRate = new decimal_js_1.default(1.1);
        }
        const size = this.estimateSize({
            cellDepCount,
            headerDepCount,
            inputs,
            outputs,
            outputsData,
        });
        log_1.logger.trace('calcFee: estimated transaction size:', size);
        return decimal_js_1.default.ceil(feeRate.times(size));
    }
    estimateSize({ cellDepCount = 1, headerDepCount = 0, inputs, outputs, outputsData = null, }) {
        if (this.helper.isNil(outputsData)) {
            outputsData = [].fill('0x', 0, outputs.length - 1);
        }
        const size = (const_1.LENGTH_BYTE_SIZE + const_1.SERIALIZED_OFFSET_BYTESIZE * 6 +
            this.txPartialSize.version +
            (const_1.LENGTH_BYTE_SIZE + cellDepCount * this.txPartialSize.cellDep) +
            (const_1.LENGTH_BYTE_SIZE + headerDepCount * this.txPartialSize.headerDep) +
            (const_1.LENGTH_BYTE_SIZE + inputs.length * this.txPartialSize.input) +
            (const_1.LENGTH_BYTE_SIZE + outputs.length * const_1.SERIALIZED_OFFSET_BYTESIZE + outputs.length * this.txPartialSize.outputTypeNull) +
            (const_1.LENGTH_BYTE_SIZE + outputsData.length * const_1.SERIALIZED_OFFSET_BYTESIZE + outputsData.length * this.txPartialSize.outputDataEmpty)) +
            (const_1.LENGTH_BYTE_SIZE + inputs.length * const_1.SERIALIZED_OFFSET_BYTESIZE + inputs.length * this.txPartialSize.witnessTypeNull);
        return size;
    }
}
exports.TransactionHelper = TransactionHelper;
exports.transactionHelper = new TransactionHelper();
