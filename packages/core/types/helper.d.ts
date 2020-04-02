/// <reference types="node" />
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isPlainObject from 'lodash/isPlainObject';
import trimEnd from 'lodash/trimEnd';
import values from 'lodash/values';
import Decimal from 'decimal.js';
import { binStr, IUTXOTransaction } from './interface';
export { filter, includes, isPlainObject, trimEnd, values, Decimal, };
export declare function isNil(obj: any): obj is null;
export declare function isString(obj: any): obj is string;
export declare function isInteger(obj: any): boolean;
export declare function isNumber(obj: any): obj is number;
export declare function isDecimal(obj: any): obj is Decimal;
export declare function isArray(obj: any): obj is any[];
export declare function isFunction(obj: any): obj is Function;
export declare function isEmpty(obj: any): boolean;
export declare function cloneDeep(obj: any): any;
export declare function sumBy(objs: any[], iteratee: string | Function): Decimal;
export declare function find(objs: any[], predicate: Function): any;
export declare function reverse(objs: any[] | Buffer): any;
/**
 * is hex
 *
 * @export
 * @param {string} str
 * @returns {boolean}
 */
export declare function isHex(str: string): boolean;
/**
 * Check if object is UTXOTransaction
 *
 * @param {any} obj
 * @returns {boolean}
 */
export declare function isUTXOTransaction(obj: any): obj is IUTXOTransaction;
/**
 * Pad hex with prefix
 *
 * @export
 * @param {string} str
 * @returns
 */
export declare function padHexPrefix(str: string): string;
/**
 * Strip hex prefix
 *
 * @export
 * @param {string} str
 * @return {string}
 */
export declare function stripHexPrefix(str: string): string;
/**
 * Convert hex to buffer
 *
 * @param str
 * @returns {Buffer}
 */
export declare function hexToBuffer(str: string): Buffer;
/**
 * Convert buffer to hex
 *
 * @param buf
 * @returns {string}
 */
export declare function bufferToHex(buf: Buffer): string;
/**
 * Format specific field
 *
 * @param obj
 * @param field
 * @param formatter
 * @param defaultVal
 * @returns {void}
 */
export declare function formatField(obj: any, field: string, formatter: Function, defaultVal?: any): void;
/**
 * Is mnemonic valid
 *
 * @param {string} mnemonic
 * @returns {boolean}
 */
export declare function isValidMnemonic(mnemonic: string): boolean;
/**
 * Is checksum of mnemonic valid
 *
 * @param mnemonic
 * @returns {null | boolean}
 */
export declare function isValidMnemonicChecksum(mnemonic: string): boolean;
/**
 * Generate mnemonic
 *
 * @param {string} lang language，get available languages from BCP47_LANG_MAP
 * @param {number} length available length: 12, 15, 18, 21, 24
 */
export declare function generateMnemonic(lang?: string, length?: number): string;
/**
 * Calculate seed from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} password
 * @return {Promise<string>}
 */
export declare function mnemonicToSeed(mnemonic: string, password?: string): Promise<string>;
/**
 * Calculate seed from mnemonic synchronously
 *
 * @param {string} mnemonic
 * @param {string} [password]
 * @return {string}
 */
export declare function mnemonicToSeedSync(mnemonic: string, password?: string): string;
/**
 * Derive keypair from seed
 *
 * @export
 * @param {Buffer} seed
 * @param {string} path
 * @return {IKeypairBuffer}
 */
export declare function deriveFromSeed(seed: Buffer | string, path: string): IKeypairBuffer;
/**
 * Derive keypair from mnemonic
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {Promise<IKeypairBuffer>}
 */
export declare function deriveFromMnemonic(mnemonic: string, path: string, password?: string): Promise<IKeypairBuffer>;
/**
 * Derive keypair from mnemonicsynchronously
 *
 * @param {string} mnemonic
 * @param {string} path
 * @param {string} password
 * @return {IKeypairBuffer}
 */
export declare function deriveFromMnemonicSync(mnemonic: string, path: string, password?: string): IKeypairBuffer;
export interface IKeypairBuffer {
    privateKey: Buffer;
    publicKey: Buffer;
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
export declare function timeout<T>(ms: number, promise: Promise<T>): Promise<T>;
/**
 * Convert binStr to buffer
 *
 * @export
 * @param {binStr} str
 * @return {Buffer}
 */
export declare function binaryStringToBuffer(str: binStr): Buffer;
/**
 * Convert binStr to hex
 *
 * @export
 * @param {binStr} str
 * @return {string}
 */
export declare function binaryStringToHex(str: binStr): string;
