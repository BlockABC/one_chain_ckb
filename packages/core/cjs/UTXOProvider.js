"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UTXOProvider {
    get rpcnode() {
        return this._rpcnode;
    }
    get keypairs() {
        return this._keypairs;
    }
    init({ rpcnode, keypairs, logger = null }) {
        this._rpcnode = rpcnode;
        this._keypairs = keypairs;
        if (!this.helper.isNil(logger)) {
            // @ts-ignore
            this.logger.setLogger({ logger });
        }
        return this;
    }
}
exports.UTXOProvider = UTXOProvider;
