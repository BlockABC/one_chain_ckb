"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trimEnd_1 = __importDefault(require("lodash/trimEnd"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const ckb_sdk_utils_1 = require("@nervosnetwork/ckb-sdk-utils");
const core_1 = require("@onechain/core");
const log_1 = require("../log");
class BlockABC {
    constructor(rpcnode) {
        this.logger = log_1.logger;
        this.supportBatch = true;
        this.rateLimit = 3;
        this.endpoint = trimEnd_1.default(rpcnode.baseUrl, '/');
    }
    async ping() {
        const startAt = Date.now();
        await this.get('/recommended_fee_rates');
        return Date.now() - startAt;
    }
    async getTx(txId) {
        return this.get(`/transaction/${txId}`);
    }
    async getAddresses(addresses) {
        const results = await this.post('/address', addresses);
        return results.map(val => {
            return {
                address: val.address,
                txCount: val.used ? 1 : 0,
            };
        });
    }
    async getUnspentOfAddresses(addresses, onlyConfirmed = false) {
        const results = await this.post('/address/unspents', addresses);
        return results.map(val => {
            const lock = {
                codeHash: val.lock_script.code_hash,
                hashType: val.lock_script.hash_type,
                args: val.lock_script.args,
            };
            return {
                txId: val.txid,
                address: val.address,
                vout: val.vout_index,
                value: new decimal_js_1.default(val.value),
                lock,
                lockHash: ckb_sdk_utils_1.scriptToHash(lock),
            };
        });
    }
    async pushTransaction(rawTransaction) {
        const ret = await this.post('/send_raw_transaction', {
            id: 1,
            jsonrpc: '2.0',
            method: 'send_transaction',
            params: [rawTransaction]
        });
        return ret.txid;
    }
    buildUrl(path, query = null) {
        let url = this.endpoint + path;
        if (query) {
            url += '?' + new URLSearchParams(query);
        }
        return url;
    }
    async get(path, query = null) {
        let ret;
        try {
            const url = this.buildUrl(path, query);
            this.logger.trace('BlockABC.get Request data: ', url);
            const startAt = Date.now();
            const res = await core_1.helper.timeout(5000, node_fetch_1.default(url, {
                method: 'GET',
                // @ts-ignore
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
            }));
            this.logger.trace('BlockABC.get Request benchmark(in ms):', Date.now() - startAt);
            if (res.ok) {
                ret = await res.text();
                if (ret) {
                    ret = JSON.parse(ret);
                    if (ret.errno !== 0) {
                        if (ret.errno === 500) {
                            let errno, errmsg, data;
                            try {
                                errno = ret.data.error.code;
                                errmsg = ret.data.error.message;
                                data = ret.data.error;
                            }
                            catch (err) {
                                this.logger.error('BlockABC.get Response error:', path, 500, ret.errmsg, ret);
                                throw core_1.NetworkError.fromCode(500, ret.errmsg);
                            }
                            this.logger.error('BlockABC.get Response error:', path, errno, errmsg, data);
                            throw new core_1.RPCError(errno, errmsg, data);
                        }
                        else {
                            this.logger.error('BlockABC.get Response error:', path, 400, ret.errmsg);
                            throw core_1.NetworkError.fromCode(400, ret.errmsg);
                        }
                    }
                }
                !PROD && this.logger.trace('BlockABC.get Response data:', path, ret);
            }
            else {
                this.logger.error('BlockABC.get Network error:', `${res.status} ${res.statusText}`);
                throw core_1.NetworkError.fromCode(res.status, `${res.status} ${res.statusText}`);
            }
        }
        catch (err) {
            if (err instanceof core_1.NetworkError || err instanceof core_1.RPCError) {
                throw err;
            }
            else {
                this.logger.error('BlockABC.get Unknown error:', path, err.message);
                throw core_1.NetworkError.fromCode(1, err.message);
            }
        }
        return ret.data;
    }
    async post(path, data, query = null) {
        let ret;
        try {
            const url = this.buildUrl(path, query);
            this.logger.trace('BlockABC.post Request data: ', url, data);
            const startAt = Date.now();
            const res = await core_1.helper.timeout(5000, node_fetch_1.default(url, {
                method: 'POST',
                // @ts-ignore
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }));
            this.logger.trace('BlockABC.post Request benchmark(in ms):', Date.now() - startAt);
            if (res.ok) {
                ret = await res.text();
                if (ret) {
                    ret = JSON.parse(ret);
                    if (ret.errno !== 0) {
                        if (ret.errno === 500) {
                            let errno, errmsg, data;
                            try {
                                errno = ret.data.error.code;
                                errmsg = ret.data.error.message;
                                data = ret.data.error;
                            }
                            catch (err) {
                                this.logger.error('BlockABC.post Response error:', path, 500, ret.errmsg, ret);
                                throw core_1.NetworkError.fromCode(500, ret.errmsg);
                            }
                            this.logger.error('BlockABC.post Response error:', path, errno, errmsg, data);
                            throw new core_1.RPCError(errno, errmsg, data);
                        }
                        else {
                            this.logger.error('BlockABC.post Response error:', path, 400, ret.errmsg);
                            throw core_1.NetworkError.fromCode(400, ret.errmsg);
                        }
                    }
                }
                !PROD && this.logger.trace('BlockABC.post Response data: ', ret);
            }
            else {
                this.logger.error('BlockABC.post Network error:', path, `${res.status} ${res.statusText}`);
                throw core_1.NetworkError.fromCode(res.status, `${res.status} ${res.statusText}`);
            }
        }
        catch (err) {
            if (err instanceof core_1.NetworkError || err instanceof core_1.RPCError) {
                throw err;
            }
            else {
                this.logger.error('BlockABC.post Unknown error:', path, err.message);
                throw core_1.NetworkError.fromCode(1, err.message);
            }
        }
        return ret.data;
    }
}
exports.BlockABC = BlockABC;
exports.default = BlockABC;
