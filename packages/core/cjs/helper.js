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
const filter_1 = __importDefault(require("lodash/filter"));
exports.filter = filter_1.default;
const includes_1 = __importDefault(require("lodash/includes"));
exports.includes = includes_1.default;
const isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
exports.isPlainObject = isPlainObject_1.default;
const trimEnd_1 = __importDefault(require("lodash/trimEnd"));
exports.trimEnd = trimEnd_1.default;
const values_1 = __importDefault(require("lodash/values"));
exports.values = values_1.default;
const clone_deep_1 = __importDefault(require("clone-deep"));
const decimal_js_1 = __importDefault(require("decimal.js"));
exports.Decimal = decimal_js_1.default;
const bip39 = __importStar(require("bip39"));
const bip32_1 = require("bip32");
const error_1 = require("./error");
const BCP47_LANG_MAP = {
    'zh-Hans': 'chinese_simplified',
    'zh-Hant': 'chinese_traditional',
    'en': 'english',
    'fr': 'french',
    'it': 'italian',
    'ja': 'japanese',
    'ko': 'korean',
    'es': 'spanish',
};
function isNil(obj) {
    return obj == null;
}
exports.isNil = isNil;
function isString(obj) {
    return typeof obj === 'string';
}
exports.isString = isString;
function isInteger(obj) {
    return Number.isInteger(obj);
}
exports.isInteger = isInteger;
function isNumber(obj) {
    return typeof obj === 'number';
}
exports.isNumber = isNumber;
function isDecimal(obj) {
    return decimal_js_1.default.isDecimal(obj);
}
exports.isDecimal = isDecimal;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function isFunction(obj) {
    return obj && (Object.prototype.toString.call(obj) === '[object Function]' ||
        typeof obj === 'function' ||
        obj instanceof Function);
}
exports.isFunction = isFunction;
function isEmpty(obj) {
    return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}
exports.isEmpty = isEmpty;
function cloneDeep(obj) {
    return clone_deep_1.default(obj, function (val) {
        if (isPlainObject_1.default(val)) {
            return clone_deep_1.default(val);
        }
        else if (decimal_js_1.default.isDecimal(val)) {
            return new decimal_js_1.default(val);
        }
        else {
            throw new Error('Object' + val + ' can not be cloned');
        }
    });
}
exports.cloneDeep = cloneDeep;
function sumBy(objs, iteratee) {
    if (isString(iteratee)) {
        const key = iteratee;
        iteratee = (obj) => new decimal_js_1.default(obj[key]);
    }
    // @ts-ignore
    return objs.map(iteratee).reduce((prev, current) => {
        return prev.add(current);
    }, new decimal_js_1.default(0));
}
exports.sumBy = sumBy;
function find(objs, predicate) {
    // @ts-ignore
    return objs.find(predicate);
}
exports.find = find;
function reverse(objs) {
    return objs == null ? objs : Array.prototype.reverse.call(objs);
}
exports.reverse = reverse;
/**
 * is hex
 *
 * @export
 * @param {string} str
 * @returns {boolean}
 */
function isHex(str) {
    return /^(?:0x)?[0-9a-f]+$/i.test(str);
}
exports.isHex = isHex;
/**
 * Check if object is UTXOTransaction
 *
 * @param {any} obj
 * @returns {boolean}
 */
function isUTXOTransaction(obj) {
    return !!obj.edit;
}
exports.isUTXOTransaction = isUTXOTransaction;
/**
 * Pad hex with prefix
 *
 * @export
 * @param {string} str
 * @returns
 */
function padHexPrefix(str) {
    return !str.startsWith('0x') ? '0x' + str : str;
}
exports.padHexPrefix = padHexPrefix;
/**
 * Strip hex prefix
 *
 * @export
 * @param {string} str
 * @return {string}
 */
function stripHexPrefix(str) {
    return str.startsWith('0x') ? str.slice(2) : str;
}
exports.stripHexPrefix = stripHexPrefix;
/**
 * Convert hex to buffer
 *
 * @param str
 * @returns {Buffer}
 */
function hexToBuffer(str) {
    return Buffer.from(stripHexPrefix(str), 'hex');
}
exports.hexToBuffer = hexToBuffer;
/**
 * Convert buffer to hex
 *
 * @param buf
 * @returns {string}
 */
function bufferToHex(buf) {
    return padHexPrefix(buf.toString('hex'));
}
exports.bufferToHex = bufferToHex;
/**
 * Format specific field
 *
 * @param obj
 * @param field
 * @param formatter
 * @param defaultVal
 * @returns {void}
 */
function formatField(obj, field, formatter, defaultVal = null) {
    if (obj.hasOwnProperty(field)) {
        obj[field] = formatter(obj[field]);
    }
    else if (isNil(defaultVal)) {
        obj[field] = defaultVal;
    }
}
exports.formatField = formatField;
/**
 * Is mnemonic valid
 *
 * @param {string} mnemonic
 * @returns {boolean}
 */
function isValidMnemonic(mnemonic) {
    try {
        bip39.mnemonicToEntropy(mnemonic);
        return true;
    }
    catch (e) {
        if (e.message.includes('Invalid mnemonic checksum')) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.isValidMnemonic = isValidMnemonic;
/**
 * Is checksum of mnemonic valid
 *
 * @param mnemonic
 * @returns {null | boolean}
 */
function isValidMnemonicChecksum(mnemonic) {
    try {
        bip39.mnemonicToEntropy(mnemonic);
        return true;
    }
    catch (e) {
        if (e.message.includes('Invalid mnemonic checksum')) {
            return false;
        }
        else {
            return null;
        }
    }
}
exports.isValidMnemonicChecksum = isValidMnemonicChecksum;
/**
 * Generate mnemonic
 *
 * @param {string} lang language，get available languages from BCP47_LANG_MAP
 * @param {number} length available length: 12, 15, 18, 21, 24
 */
function generateMnemonic(lang = 'en', length = 12) {
    if (!BCP47_LANG_MAP.hasOwnProperty(lang)) {
        throw error_1.OneChainError.fromCode(14);
    }
    if (!includes_1.default([12, 15, 18, 21, 24], length)) {
        throw error_1.OneChainError.fromCode(15);
    }
    const strength = length / 3 * 32;
    return bip39.generateMnemonic(strength, null, bip39.wordlists[BCP47_LANG_MAP[lang]]);
}
exports.generateMnemonic = generateMnemonic;
/**
 * Calculate seed from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} password
 * @return {Promise<string>}
 */
async function mnemonicToSeed(mnemonic, password = null) {
    let ret;
    const mnemonicWithoutSpace = filter_1.default(mnemonic.split(' '));
    if (!includes_1.default([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw error_1.OneChainError.fromCode(15);
    }
    try {
        const buf = await bip39.mnemonicToSeed(mnemonicWithoutSpace.join(' '), password);
        ret = buf.toString('hex');
    }
    catch (err) {
        throw error_1.OneChainError.fromCode(13);
    }
    return ret;
}
exports.mnemonicToSeed = mnemonicToSeed;
/**
 * Calculate seed from mnemonic synchronously
 *
 * @param {string} mnemonic
 * @param {string} [password]
 * @return {string}
 */
function mnemonicToSeedSync(mnemonic, password) {
    let ret;
    const mnemonicWithoutSpace = filter_1.default(mnemonic.split(' '));
    if (!includes_1.default([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw error_1.OneChainError.fromCode(15);
    }
    try {
        const buf = bip39.mnemonicToSeedSync(mnemonicWithoutSpace.join(' '), password);
        ret = buf.toString('hex');
    }
    catch (err) {
        throw error_1.OneChainError.fromCode(13);
    }
    return ret;
}
exports.mnemonicToSeedSync = mnemonicToSeedSync;
/**
 * Derive keypair from seed
 *
 * @export
 * @param {Buffer} seed
 * @param {string} path
 * @return {IKeypairBuffer}
 */
function deriveFromSeed(seed, path) {
    if (typeof seed === 'string') {
        seed = Buffer.from(seed);
    }
    const root = bip32_1.fromSeed(seed);
    let node;
    try {
        node = root.derivePath(path);
    }
    catch (err) {
        if (err.message.match('Expected BIP32Path')) {
            throw error_1.OneChainError.fromCode(22);
        }
        else {
            throw err;
        }
    }
    return {
        privateKey: node.privateKey,
        publicKey: node.publicKey,
    };
}
exports.deriveFromSeed = deriveFromSeed;
/**
 * Derive keypair from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {Promise<IKeypairBuffer>}
 */
async function deriveFromMnemonic(mnemonic, path, password) {
    const mnemonicWithoutSpace = filter_1.default(mnemonic.split(' '));
    if (!includes_1.default([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw error_1.OneChainError.fromCode(15);
    }
    const seed = await bip39.mnemonicToSeed(mnemonicWithoutSpace.join(' '), password);
    return deriveFromSeed(seed, path);
}
exports.deriveFromMnemonic = deriveFromMnemonic;
/**
 * Derive keypair from mnemonicsynchronously
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {IKeypairBuffer}
 */
function deriveFromMnemonicSync(mnemonic, path, password) {
    const mnemonicWithoutSpace = filter_1.default(mnemonic.split(' '));
    if (!includes_1.default([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw error_1.OneChainError.fromCode(15);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonicWithoutSpace.join(' '), password);
    return deriveFromSeed(seed, path);
}
exports.deriveFromMnemonicSync = deriveFromMnemonicSync;
/**
 * Limit promise resolve time
 *
 * @export
 * @template T
 * @param {number} ms
 * @param {Promise<T>} promise
 * @return {Promise<T>}
 */
function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(error_1.NetworkError.fromCode(500, `Response timeout in ${ms} ms.`));
        }, ms);
        promise.then(resolve, reject);
    });
}
exports.timeout = timeout;
/**
 * Convert binStr to buffer
 *
 * @export
 * @param {binStr} str
 * @return {Buffer}
 */
function binaryStringToBuffer(str) {
    if (Buffer.isBuffer(str)) {
        return str;
    }
    else if (str.startsWith('0x')) {
        return Buffer.from(str.slice(2), 'hex');
    }
    else {
        return Buffer.from(str, 'utf8');
    }
}
exports.binaryStringToBuffer = binaryStringToBuffer;
/**
 * Convert binStr to hex
 *
 * @export
 * @param {binStr} str
 * @return {string}
 */
function binaryStringToHex(str) {
    if (Buffer.isBuffer(str)) {
        return '0x' + str.toString('hex');
    }
    else if (str.startsWith('0x')) {
        return str;
    }
    else {
        return '0x' + Buffer.from(str, 'utf8').toString('hex');
    }
}
exports.binaryStringToHex = binaryStringToHex;
