import { AddressPrefix } from '@nervosnetwork/ckb-sdk-utils';
import { ScriptHashType } from './const';
import { ISystemScript, IScript } from './interface';
export default class LockUtils {
    systemScript: ISystemScript;
    constructor(systemScript: ISystemScript);
    private static systemScriptInfo;
    private static previousURL;
    static loadSystemScript(nodeURL: string): Promise<ISystemScript>;
    static systemScript(nodeURL: string): Promise<ISystemScript>;
    addressToLockScript(address: string, hashType?: ScriptHashType): IScript;
    addressToLockHash(address: string, hashType?: ScriptHashType): string;
    addressToAllLockHashes(address: string): string[];
    addressesToAllLockHashes(addresses: string[]): string[];
    static computeScriptHash: (script: IScript) => string;
    static lockScriptToHash: (lock: IScript) => string;
    static lockScriptToAddress(lock: IScript, prefix?: AddressPrefix): string;
    static blake160ToAddress(blake160: string, prefix?: AddressPrefix): string;
    static addressToBlake160(address: string): string;
}
