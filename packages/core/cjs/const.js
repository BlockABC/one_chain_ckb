"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChainType;
(function (ChainType) {
    ChainType["CKB"] = "ckb";
})(ChainType = exports.ChainType || (exports.ChainType = {}));
var NetworkProtocol;
(function (NetworkProtocol) {
    NetworkProtocol["HTTP"] = "http";
    NetworkProtocol["HTTPS"] = "https";
    NetworkProtocol["WS"] = "ws";
    NetworkProtocol["WSS"] = "wss";
})(NetworkProtocol = exports.NetworkProtocol || (exports.NetworkProtocol = {}));
var Level;
(function (Level) {
    Level[Level["Trace"] = 0] = "Trace";
    Level[Level["Debug"] = 1] = "Debug";
    Level[Level["Info"] = 2] = "Info";
    Level[Level["Warn"] = 3] = "Warn";
    Level[Level["Error"] = 4] = "Error";
})(Level = exports.Level || (exports.Level = {}));
