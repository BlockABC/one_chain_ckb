"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
/* eslint-disable @typescript-eslint/no-empty-function */
const levelToName = {
    [const_1.Level.Trace]: 'TRACE',
    [const_1.Level.Debug]: 'DEBUG',
    [const_1.Level.Info]: 'INFO',
    [const_1.Level.Warn]: 'WARN',
    [const_1.Level.Error]: 'ERROR',
};
const levelToOriginalMethod = {
    [const_1.Level.Trace]: 'debug',
    [const_1.Level.Debug]: 'log',
    [const_1.Level.Info]: 'info',
    [const_1.Level.Warn]: 'warn',
    [const_1.Level.Error]: 'error',
};
class ConsoleLogger {
    constructor({ name = 'default', level = ConsoleLogger.Level.Info }) {
        this._logFn = {
            [const_1.Level.Trace]: function (message, ...args) { },
            [const_1.Level.Debug]: function (message, ...args) { },
            [const_1.Level.Info]: function (message, ...args) { },
            [const_1.Level.Warn]: function (message, ...args) { },
            [const_1.Level.Error]: function (message, ...args) { },
        };
        this._name = name;
        this._level = level;
        this._logFnFactory({ name: this._name, level: this._level });
    }
    get trace() {
        return this._logFn[const_1.Level.Trace];
    }
    get debug() {
        return this._logFn[const_1.Level.Debug];
    }
    get info() {
        return this._logFn[const_1.Level.Info];
    }
    get warn() {
        return this._logFn[const_1.Level.Warn];
    }
    get error() {
        return this._logFn[const_1.Level.Error];
    }
    setLevel({ level }) {
        this._level = level;
        this._logFnFactory({ name: this._name, level: this._level });
        this._logFn[const_1.Level.Info](`Change log level to ${levelToName[level]}`);
    }
    _logFnFactory({ name, level }) {
        Object.values(const_1.Level).forEach((value) => {
            if (Number.isInteger(value)) {
                if (level > value) {
                    this._logFn[value] = function () { };
                }
                else {
                    this._logFn[value] = console[levelToOriginalMethod[value]].bind(console, `[${name}] [${levelToName[value]}]`);
                }
            }
        });
    }
}
exports.ConsoleLogger = ConsoleLogger;
ConsoleLogger.Level = const_1.Level;
exports.default = ConsoleLogger;
