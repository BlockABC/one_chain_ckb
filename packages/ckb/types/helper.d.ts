/// <reference types="@nervosnetwork/ckb-types" />
/// <reference types="../types/rpc" />
/// <reference types="lodash" />
import { IKeypair, IUTXOUnspent, helper as coreHelper } from '@onechain/core';
declare const toSnakeCaseTransaction: (transaction: CKBComponents.RawTransaction) => RPC.RawTransaction;
declare const toCamelCaseTransaction: (tx: RPC.Transaction) => CKBComponents.Transaction;
export { toSnakeCaseTransaction, toCamelCaseTransaction };
export declare const isNil: typeof coreHelper.isNil, isInteger: typeof coreHelper.isInteger, isNumber: typeof coreHelper.isNumber, isDecimal: typeof coreHelper.isDecimal, isArray: typeof coreHelper.isArray, cloneDeep: typeof coreHelper.cloneDeep, sumBy: typeof coreHelper.sumBy, find: typeof coreHelper.find, reverse: typeof coreHelper.reverse, trimEnd: {
    (string?: string, chars?: string): string;
    (string: string, index: string | number, guard: object): string;
}, filter: {
    (collection: string, predicate?: import("lodash").StringIterator<boolean>): string[];
    <T, S extends T>(collection: import("lodash").List<T>, predicate: import("lodash").ListIteratorTypeGuard<T, S>): S[];
    <T_1>(collection: import("lodash").List<T_1>, predicate?: import("lodash").ListIterateeCustom<T_1, boolean>): T_1[];
    <T_2 extends object, S_1 extends T_2[keyof T_2]>(collection: T_2, predicate: import("lodash").ObjectIteratorTypeGuard<T_2, S_1>): S_1[];
    <T_3 extends object>(collection: T_3, predicate?: import("lodash").ObjectIterateeCustom<T_3, boolean>): T_3[keyof T_3][];
}, values: {
    <T>(object: import("lodash").Dictionary<T> | import("lodash").NumericDictionary<T> | import("lodash").List<T>): T[];
    <T_1 extends object>(object: T_1): T_1[keyof T_1][];
    (object: any): any[];
}, isUTXOTransaction: typeof coreHelper.isUTXOTransaction, isHex: typeof coreHelper.isHex, padHexPrefix: typeof coreHelper.padHexPrefix, stripHexPrefix: typeof coreHelper.stripHexPrefix, isValidMnemonic: typeof coreHelper.isValidMnemonic, isValidMnemonicChecksum: typeof coreHelper.isValidMnemonicChecksum, generateMnemonic: typeof coreHelper.generateMnemonic, mnemonicToSeed: typeof coreHelper.mnemonicToSeed, mnemonicToSeedSync: typeof coreHelper.mnemonicToSeedSync, deriveFromSeed: typeof coreHelper.deriveFromSeed, deriveFromMnemonic: typeof coreHelper.deriveFromMnemonic, deriveFromMnemonicSync: typeof coreHelper.deriveFromMnemonicSync, binaryStringToBuffer: typeof coreHelper.binaryStringToBuffer;
/**
 * Is valid address
 *
 * @param {string} addressStr
 * @return {boolean}
 */
export declare function isValidAddress(addressStr: string): boolean;
/**
 * Is valid public key
 *
 * @param {string} publicKeyStr
 * @return {boolean}
 */
export declare function isValidPublicKey(publicKeyStr: string): boolean;
/**
 * Is valid private key
 *
 * Range of private key: https://en.bitcoin.it/wiki/Private_key
 *
 * @param {string} privateKeyStr
 * @return {boolean}
 */
export declare function isValidPrivateKey(privateKeyStr: string): boolean;
export declare function getNetworkByChainId(chainId: string): any;
/**
 * Generate keypair by network
 *
 * @param network
 * @return {IKeypair}
 */
export declare function generateKeypairByNetwork(network: any): IKeypair;
/**
 * Generate keypair
 *
 * @param {string} chainId
 * @return {IKeypair}
 */
export declare function generateKeypair(chainId: string): IKeypair;
/**
 * Derive keypair from private key base on network
 *
 * @param {string} privateKey
 * @param {any} network
 * @return {IKeypair}
 */
export declare function privateKeyToAddressByNetwork(privateKey: string, network: any): IKeypair;
/**
 * Derive keypair from private key
 *
 * @param {string} privateKey
 * @param {string} chainId
 * @return {IKeypair}
 */
export declare function privateKeyToAddress(privateKey: string, chainId: string): IKeypair;
/**
 * Convert lock script to address base on network
 *
 * @param {IScript | RPC.Script} lockScript
 * @param {INetwork} network
 * @returns {string}
 */
export declare function lockToAddressByNetwork(lockScript: any, network: any): string;
/**
 * Convert lock script to address
 *
 * @param {IScript | RPC.Script} lockScript
 * @param {string} chainId
 * @returns {string}
 */
export declare function lockToAddress(lockScript: any, chainId: string): string;
/**
 * Serialize raw transaction
 *
 * @param tx
 * @returns {string}
 */
export declare function serializeRawTransaction(tx: any): string;
/**
 * Count raw transaction size
 *
 * @param tx
 * @returns {number}
 */
export declare function countRawTransactionSize(tx: any): number;
/**
 * Get raw transaction ID
 *
 * @param tx
 * @returns {string}
 */
export declare function getRawTransactionID(tx: any): string;
/**
 * Parse raw transaction base on network
 *
 * @export
 * @param {any} rawTransaction
 * @param {IUTXOUnspent[]} [unspents=[]]
 * @param {INetwork} [network=null]
 * @return {any}
 */
export declare function parseRawTransactionByNetwork(rawTransaction: any, unspents?: IUTXOUnspent[], network?: any): any;
/**
 * Parse raw transaction
 *
 * @export
 * @param {any} rawTransaction
 * @param {IUTXOUnspent[]} [unspents=[]]
 * @param {string} [chainId='mainnet']
 * @return {any}
 */
export declare function parseRawTransaction(rawTransaction: any, unspents?: IUTXOUnspent[], chainId?: string): any;
