import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isPlainObject from 'lodash/isPlainObject';
import trimEnd from 'lodash/trimEnd';
import values from 'lodash/values';
import cloneDeepPure from 'clone-deep';
import Decimal from 'decimal.js';
import * as bip39 from 'bip39';
import { fromSeed as bip32fromSeed } from 'bip32';
import { OneChainError, NetworkError } from './error';
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
export { filter, includes, isPlainObject, trimEnd, values, Decimal, };
export function isNil(obj) {
    return obj == null;
}
export function isString(obj) {
    return typeof obj === 'string';
}
export function isInteger(obj) {
    return Number.isInteger(obj);
}
export function isNumber(obj) {
    return typeof obj === 'number';
}
export function isDecimal(obj) {
    return Decimal.isDecimal(obj);
}
export function isArray(obj) {
    return Array.isArray(obj);
}
export function isFunction(obj) {
    return obj && (Object.prototype.toString.call(obj) === '[object Function]' ||
        typeof obj === 'function' ||
        obj instanceof Function);
}
export function isEmpty(obj) {
    return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}
export function cloneDeep(obj) {
    return cloneDeepPure(obj, function (val) {
        if (isPlainObject(val)) {
            return cloneDeepPure(val);
        }
        else if (Decimal.isDecimal(val)) {
            return new Decimal(val);
        }
        else {
            throw new Error('Object' + val + ' can not be cloned');
        }
    });
}
export function sumBy(objs, iteratee) {
    if (isString(iteratee)) {
        const key = iteratee;
        iteratee = (obj) => new Decimal(obj[key]);
    }
    // @ts-ignore
    return objs.map(iteratee).reduce((prev, current) => {
        return prev.add(current);
    }, new Decimal(0));
}
export function find(objs, predicate) {
    // @ts-ignore
    return objs.find(predicate);
}
export function reverse(objs) {
    return objs == null ? objs : Array.prototype.reverse.call(objs);
}
/**
 * is hex
 *
 * @export
 * @param {string} str
 * @returns {boolean}
 */
export function isHex(str) {
    return /^(?:0x)?[0-9a-f]+$/i.test(str);
}
/**
 * Check if object is UTXOTransaction
 *
 * @param {any} obj
 * @returns {boolean}
 */
export function isUTXOTransaction(obj) {
    return !!obj.edit;
}
/**
 * Pad hex with prefix
 *
 * @export
 * @param {string} str
 * @returns
 */
export function padHexPrefix(str) {
    return !str.startsWith('0x') ? '0x' + str : str;
}
/**
 * Strip hex prefix
 *
 * @export
 * @param {string} str
 * @return {string}
 */
export function stripHexPrefix(str) {
    return str.startsWith('0x') ? str.slice(2) : str;
}
/**
 * Convert hex to buffer
 *
 * @param str
 * @returns {Buffer}
 */
export function hexToBuffer(str) {
    return Buffer.from(stripHexPrefix(str), 'hex');
}
/**
 * Convert buffer to hex
 *
 * @param buf
 * @returns {string}
 */
export function bufferToHex(buf) {
    return padHexPrefix(buf.toString('hex'));
}
/**
 * Format specific field
 *
 * @param obj
 * @param field
 * @param formatter
 * @param defaultVal
 * @returns {void}
 */
export function formatField(obj, field, formatter, defaultVal = null) {
    if (obj.hasOwnProperty(field)) {
        obj[field] = formatter(obj[field]);
    }
    else if (isNil(defaultVal)) {
        obj[field] = defaultVal;
    }
}
/**
 * Is mnemonic valid
 *
 * @param {string} mnemonic
 * @returns {boolean}
 */
export function isValidMnemonic(mnemonic) {
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
/**
 * Is checksum of mnemonic valid
 *
 * @param mnemonic
 * @returns {null | boolean}
 */
export function isValidMnemonicChecksum(mnemonic) {
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
/**
 * Generate mnemonic
 *
 * @param {string} lang language，get available languages from BCP47_LANG_MAP
 * @param {number} length available length: 12, 15, 18, 21, 24
 */
export function generateMnemonic(lang = 'en', length = 12) {
    if (!BCP47_LANG_MAP.hasOwnProperty(lang)) {
        throw OneChainError.fromCode(14);
    }
    if (!includes([12, 15, 18, 21, 24], length)) {
        throw OneChainError.fromCode(15);
    }
    const strength = length / 3 * 32;
    return bip39.generateMnemonic(strength, null, bip39.wordlists[BCP47_LANG_MAP[lang]]);
}
/**
 * Calculate seed from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} password
 * @return {Promise<string>}
 */
export async function mnemonicToSeed(mnemonic, password = null) {
    let ret;
    const mnemonicWithoutSpace = filter(mnemonic.split(' '));
    if (!includes([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw OneChainError.fromCode(15);
    }
    try {
        const buf = await bip39.mnemonicToSeed(mnemonicWithoutSpace.join(' '), password);
        ret = buf.toString('hex');
    }
    catch (err) {
        throw OneChainError.fromCode(13);
    }
    return ret;
}
/**
 * Calculate seed from mnemonic synchronously
 *
 * @param {string} mnemonic
 * @param {string} [password]
 * @return {string}
 */
export function mnemonicToSeedSync(mnemonic, password) {
    let ret;
    const mnemonicWithoutSpace = filter(mnemonic.split(' '));
    if (!includes([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw OneChainError.fromCode(15);
    }
    try {
        const buf = bip39.mnemonicToSeedSync(mnemonicWithoutSpace.join(' '), password);
        ret = buf.toString('hex');
    }
    catch (err) {
        throw OneChainError.fromCode(13);
    }
    return ret;
}
/**
 * Derive keypair from seed
 *
 * @export
 * @param {Buffer} seed
 * @param {string} path
 * @return {IKeypairBuffer}
 */
export function deriveFromSeed(seed, path) {
    if (typeof seed === 'string') {
        seed = Buffer.from(seed);
    }
    const root = bip32fromSeed(seed);
    let node;
    try {
        node = root.derivePath(path);
    }
    catch (err) {
        if (err.message.match('Expected BIP32Path')) {
            throw OneChainError.fromCode(22);
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
/**
 * Derive keypair from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {Promise<IKeypairBuffer>}
 */
export async function deriveFromMnemonic(mnemonic, path, password) {
    const mnemonicWithoutSpace = filter(mnemonic.split(' '));
    if (!includes([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw OneChainError.fromCode(15);
    }
    const seed = await bip39.mnemonicToSeed(mnemonicWithoutSpace.join(' '), password);
    return deriveFromSeed(seed, path);
}
/**
 * Derive keypair from mnemonicsynchronously
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {IKeypairBuffer}
 */
export function deriveFromMnemonicSync(mnemonic, path, password) {
    const mnemonicWithoutSpace = filter(mnemonic.split(' '));
    if (!includes([12, 15, 18, 21, 24], mnemonicWithoutSpace.length)) {
        throw OneChainError.fromCode(15);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonicWithoutSpace.join(' '), password);
    return deriveFromSeed(seed, path);
}
/**
 * Limit promise resolve time
 *
 * @export
 * @template T
 * @param {number} ms
 * @param {Promise<T>} promise
 * @return {Promise<T>}
 */
export function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(NetworkError.fromCode(500, `Response timeout in ${ms} ms.`));
        }, ms);
        promise.then(resolve, reject);
    });
}
/**
 * Convert binStr to buffer
 *
 * @export
 * @param {binStr} str
 * @return {Buffer}
 */
export function binaryStringToBuffer(str) {
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
/**
 * Convert binStr to hex
 *
 * @export
 * @param {binStr} str
 * @return {string}
 */
export function binaryStringToHex(str) {
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
