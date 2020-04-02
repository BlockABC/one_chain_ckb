"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tiny_secp256k1_1 = __importDefault(require("tiny-secp256k1"));
const randombytes_1 = __importDefault(require("randombytes"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const ecpair_1 = __importDefault(require("@nervosnetwork/ckb-sdk-utils/lib/ecpair"));
const ckb_sdk_utils_1 = require("@nervosnetwork/ckb-sdk-utils");
const transaction_1 = require("@nervosnetwork/ckb-sdk-utils/lib/serialization/transaction");
const paramsFormatter_1 = __importDefault(require("@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter"));
const resultFormatter_1 = __importDefault(require("@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter"));
const core_1 = require("@onechain/core");
const const_1 = require("./const");
const lock_utils_1 = __importDefault(require("./lock-utils"));
const toSnakeCaseTransaction = paramsFormatter_1.default.toRawTransaction;
exports.toSnakeCaseTransaction = toSnakeCaseTransaction;
const toCamelCaseTransaction = resultFormatter_1.default.toTransaction;
exports.toCamelCaseTransaction = toCamelCaseTransaction;
exports.isNil = core_1.helper.isNil, exports.isInteger = core_1.helper.isInteger, exports.isNumber = core_1.helper.isNumber, exports.isDecimal = core_1.helper.isDecimal, exports.isArray = core_1.helper.isArray, exports.cloneDeep = core_1.helper.cloneDeep, exports.sumBy = core_1.helper.sumBy, exports.find = core_1.helper.find, exports.reverse = core_1.helper.reverse, exports.trimEnd = core_1.helper.trimEnd, exports.filter = core_1.helper.filter, exports.values = core_1.helper.values, exports.isUTXOTransaction = core_1.helper.isUTXOTransaction, exports.isHex = core_1.helper.isHex, exports.padHexPrefix = core_1.helper.padHexPrefix, exports.stripHexPrefix = core_1.helper.stripHexPrefix, exports.isValidMnemonic = core_1.helper.isValidMnemonic, exports.isValidMnemonicChecksum = core_1.helper.isValidMnemonicChecksum, exports.generateMnemonic = core_1.helper.generateMnemonic, exports.mnemonicToSeed = core_1.helper.mnemonicToSeed, exports.mnemonicToSeedSync = core_1.helper.mnemonicToSeedSync, exports.deriveFromSeed = core_1.helper.deriveFromSeed, exports.deriveFromMnemonic = core_1.helper.deriveFromMnemonic, exports.deriveFromMnemonicSync = core_1.helper.deriveFromMnemonicSync, exports.binaryStringToBuffer = core_1.helper.binaryStringToBuffer;
/**
 * Is valid address
 *
 * @param {string} addressStr
 * @return {boolean}
 */
function isValidAddress(addressStr) {
    try {
        ckb_sdk_utils_1.bech32.decode(addressStr);
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.isValidAddress = isValidAddress;
/**
 * Is valid public key
 *
 * @param {string} publicKeyStr
 * @return {boolean}
 */
function isValidPublicKey(publicKeyStr) {
    const publicKeyBuf = Buffer.from(exports.stripHexPrefix(publicKeyStr), 'hex');
    return tiny_secp256k1_1.default.isPoint(publicKeyBuf);
}
exports.isValidPublicKey = isValidPublicKey;
/**
 * Is valid private key
 *
 * Range of private key: https://en.bitcoin.it/wiki/Private_key
 *
 * @param {string} privateKeyStr
 * @return {boolean}
 */
function isValidPrivateKey(privateKeyStr) {
    let privateKeyBuf = Buffer.from(exports.stripHexPrefix(privateKeyStr), 'hex');
    privateKeyBuf = Buffer.concat([Buffer.alloc((32 - privateKeyBuf.length)), privateKeyBuf]);
    return tiny_secp256k1_1.default.isPrivate(privateKeyBuf);
}
exports.isValidPrivateKey = isValidPrivateKey;
function getNetworkByChainId(chainId) {
    let network;
    switch (chainId) {
        case 'mainnet':
            network = const_1.MAINNET;
            break;
        case 'testnet':
            network = const_1.TESTNET;
            break;
        default:
            throw core_1.OneChainError.fromCode(10);
    }
    return network;
}
exports.getNetworkByChainId = getNetworkByChainId;
/**
 * Generate keypair by network
 *
 * @param network
 * @return {IKeypair}
 */
function generateKeypairByNetwork(network) {
    let num;
    do {
        num = randombytes_1.default(32);
    } while (!tiny_secp256k1_1.default.isPrivate(num));
    const ecpair = new ecpair_1.default(num);
    return {
        address: ckb_sdk_utils_1.pubkeyToAddress(ecpair.publicKey, {
            prefix: network.addressPrefix,
            type: ckb_sdk_utils_1.AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x00'
        }),
        publicKey: ecpair.publicKey,
        privateKey: ecpair.privateKey,
        wif: ecpair.privateKey,
    };
}
exports.generateKeypairByNetwork = generateKeypairByNetwork;
/**
 * Generate keypair
 *
 * @param {string} chainId
 * @return {IKeypair}
 */
function generateKeypair(chainId) {
    return generateKeypairByNetwork(getNetworkByChainId(chainId));
}
exports.generateKeypair = generateKeypair;
/**
 * Derive keypair from private key base on network
 *
 * @param {string} privateKey
 * @param {any} network
 * @return {IKeypair}
 */
function privateKeyToAddressByNetwork(privateKey, network) {
    if (!isValidPrivateKey(privateKey)) {
        throw core_1.OneChainError.fromCode(12);
    }
    const privateKeyBuf = Buffer.from(exports.stripHexPrefix(privateKey), 'hex');
    const ecpair = new ecpair_1.default(privateKeyBuf);
    return {
        address: ckb_sdk_utils_1.pubkeyToAddress(ecpair.publicKey, {
            prefix: network.addressPrefix,
            type: ckb_sdk_utils_1.AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x00'
        }),
        publicKey: ecpair.publicKey,
        privateKey: ecpair.privateKey,
        wif: ecpair.privateKey,
    };
}
exports.privateKeyToAddressByNetwork = privateKeyToAddressByNetwork;
/**
 * Derive keypair from private key
 *
 * @param {string} privateKey
 * @param {string} chainId
 * @return {IKeypair}
 */
function privateKeyToAddress(privateKey, chainId) {
    return privateKeyToAddressByNetwork(privateKey, getNetworkByChainId(chainId));
}
exports.privateKeyToAddress = privateKeyToAddress;
/**
 * Convert lock script to address base on network
 *
 * @param {IScript | RPC.Script} lockScript
 * @param {INetwork} network
 * @returns {string}
 */
function lockToAddressByNetwork(lockScript, network) {
    return lock_utils_1.default.blake160ToAddress(lockScript.args, network.addressPrefix);
}
exports.lockToAddressByNetwork = lockToAddressByNetwork;
/**
 * Convert lock script to address
 *
 * @param {IScript | RPC.Script} lockScript
 * @param {string} chainId
 * @returns {string}
 */
function lockToAddress(lockScript, chainId) {
    const network = getNetworkByChainId(chainId);
    return lockToAddressByNetwork(lockScript, network);
}
exports.lockToAddress = lockToAddress;
/**
 * Serialize raw transaction
 *
 * @param tx
 * @returns {string}
 */
function serializeRawTransaction(tx) {
    return transaction_1.serializeTransaction(toCamelCaseTransaction(exports.cloneDeep(tx)));
}
exports.serializeRawTransaction = serializeRawTransaction;
/**
 * Count raw transaction size
 *
 * @param tx
 * @returns {number}
 */
function countRawTransactionSize(tx) {
    const serializedTransaction = serializeRawTransaction(tx);
    return Buffer.byteLength(exports.stripHexPrefix(serializedTransaction), 'hex');
}
exports.countRawTransactionSize = countRawTransactionSize;
/**
 * Get raw transaction ID
 *
 * @param tx
 * @returns {string}
 */
function getRawTransactionID(tx) {
    return ckb_sdk_utils_1.rawTransactionToHash(toCamelCaseTransaction(exports.cloneDeep(tx)));
}
exports.getRawTransactionID = getRawTransactionID;
/**
 * Parse raw transaction base on network
 *
 * @export
 * @param {any} rawTransaction
 * @param {IUTXOUnspent[]} [unspents=[]]
 * @param {INetwork} [network=null]
 * @return {any}
 */
function parseRawTransactionByNetwork(rawTransaction, unspents = [], network = null) {
    let fee = '';
    if (unspents.length > 0) {
        const inputValue = exports.sumBy(unspents, 'value');
        const outputValue = exports.sumBy(rawTransaction.outputs.map((output) => ({ value: new decimal_js_1.default(output.capacity) })), 'value');
        fee = inputValue.sub(outputValue).toString();
    }
    return {
        txid: getRawTransactionID(rawTransaction),
        iscoinbase: false,
        fee: fee,
        block_height: 0,
        blockhash: '',
        blocktime: '1970-01-01T00:00:00+0000',
        confirmations: 0,
        inputs: rawTransaction.inputs.map((input) => {
            let fromAddress = '';
            let value = '0';
            if (unspents.length > 0) {
                const unspent = unspents.find((unspent) => {
                    return input.previous_output.tx_hash === unspent.txId &&
                        input.previous_output.index === new decimal_js_1.default(unspent.vout).toHex();
                });
                if (unspent) {
                    fromAddress = unspent.address;
                    value = decimal_js_1.default.isDecimal(unspent.value) ? unspent.value.toString() : unspent.value;
                }
            }
            return {
                from_address: fromAddress,
                from_txid: input.previous_output.tx_hash,
                vin_index: new decimal_js_1.default(input.previous_output.index).toString(),
                value: value,
                sequence: '',
            };
        }),
        outputs: rawTransaction.outputs.map((output, index) => {
            return {
                to_address: lockToAddressByNetwork(output.lock, network),
                vout_index: index,
                value: new decimal_js_1.default(output.capacity).toString(),
                type: 'pubkeyhash',
                asm: '',
                hex: '',
            };
        }),
    };
}
exports.parseRawTransactionByNetwork = parseRawTransactionByNetwork;
/**
 * Parse raw transaction
 *
 * @export
 * @param {any} rawTransaction
 * @param {IUTXOUnspent[]} [unspents=[]]
 * @param {string} [chainId='mainnet']
 * @return {any}
 */
function parseRawTransaction(rawTransaction, unspents = [], chainId = 'mainnet') {
    return parseRawTransactionByNetwork(rawTransaction, unspents, getNetworkByChainId(chainId));
}
exports.parseRawTransaction = parseRawTransaction;
