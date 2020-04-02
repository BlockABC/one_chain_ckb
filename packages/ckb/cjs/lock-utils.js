"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ckb_sdk_utils_1 = require("@nervosnetwork/ckb-sdk-utils");
const ckb_sdk_core_1 = __importDefault(require("@nervosnetwork/ckb-sdk-core"));
const const_1 = require("./const");
class LockUtils {
    constructor(systemScript) {
        this.systemScript = systemScript;
    }
    static async loadSystemScript(nodeURL) {
        const core = new ckb_sdk_core_1.default(nodeURL);
        const systemCell = await core.loadSecp256k1Dep();
        let { codeHash } = systemCell;
        const { outPoint, hashType } = systemCell;
        let { txHash } = outPoint;
        const { index } = outPoint;
        if (!codeHash.startsWith('0x')) {
            codeHash = `0x${codeHash}`;
        }
        if (!txHash.startsWith('0x')) {
            txHash = `0x${txHash}`;
        }
        return {
            codeHash,
            outPoint: { txHash, index },
            hashType: hashType
        };
    }
    static async systemScript(nodeURL) {
        if (LockUtils.systemScriptInfo && nodeURL === LockUtils.previousURL) {
            return LockUtils.systemScriptInfo;
        }
        LockUtils.systemScriptInfo = await LockUtils.loadSystemScript(nodeURL);
        LockUtils.previousURL = nodeURL;
        return LockUtils.systemScriptInfo;
    }
    addressToLockScript(address, hashType = const_1.ScriptHashType.Type) {
        return {
            codeHash: this.systemScript.codeHash,
            args: LockUtils.addressToBlake160(address),
            hashType,
        };
    }
    addressToLockHash(address, hashType = const_1.ScriptHashType.Type) {
        const lock = this.addressToLockScript(address, hashType);
        return LockUtils.lockScriptToHash(lock);
    }
    addressToAllLockHashes(address) {
        return [this.addressToLockHash(address, const_1.ScriptHashType.Type)];
    }
    addressesToAllLockHashes(addresses) {
        return addresses.map(addr => {
            return this.addressToAllLockHashes(addr);
        }).reduce((acc, val) => acc.concat(val), []);
    }
    static lockScriptToAddress(lock, prefix = ckb_sdk_utils_1.AddressPrefix.Mainnet) {
        const blake160 = lock.args;
        return LockUtils.blake160ToAddress(blake160, prefix);
    }
    static blake160ToAddress(blake160, prefix = ckb_sdk_utils_1.AddressPrefix.Mainnet) {
        return ckb_sdk_utils_1.bech32Address(blake160, {
            prefix,
            type: ckb_sdk_utils_1.AddressType.HashIdx,
            codeHashOrCodeHashIndex: '0x00',
        });
    }
    static addressToBlake160(address) {
        const result = ckb_sdk_utils_1.parseAddress(address, 'hex');
        const hrp = `0100`;
        let blake160 = result.slice(hrp.length + 2, result.length);
        if (!blake160.startsWith('0x')) {
            blake160 = `0x${blake160}`;
        }
        return blake160;
    }
}
exports.default = LockUtils;
LockUtils.computeScriptHash = (script) => {
    // const ckbScript: CKBComponents.Script = ConvertTo.toSdkScript(script)
    // const hash: string = scriptToHash(ckbScript)
    // if (!hash.startsWith('0x')) {
    //   return `0x${hash}`
    // }
    // return hash
    return '';
};
// use SDK lockScriptToHash
LockUtils.lockScriptToHash = (lock) => {
    return LockUtils.computeScriptHash(lock);
};
