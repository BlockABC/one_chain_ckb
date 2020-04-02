import { Level } from './const';
/* eslint-disable @typescript-eslint/no-empty-function */
const levelToName = {
    [Level.Trace]: 'TRACE',
    [Level.Debug]: 'DEBUG',
    [Level.Info]: 'INFO',
    [Level.Warn]: 'WARN',
    [Level.Error]: 'ERROR',
};
const levelToOriginalMethod = {
    [Level.Trace]: 'debug',
    [Level.Debug]: 'log',
    [Level.Info]: 'info',
    [Level.Warn]: 'warn',
    [Level.Error]: 'error',
};
export class ConsoleLogger {
    constructor({ name = 'default', level = ConsoleLogger.Level.Info }) {
        this._logFn = {
            [Level.Trace]: function (message, ...args) { },
            [Level.Debug]: function (message, ...args) { },
            [Level.Info]: function (message, ...args) { },
            [Level.Warn]: function (message, ...args) { },
            [Level.Error]: function (message, ...args) { },
        };
        this._name = name;
        this._level = level;
        this._logFnFactory({ name: this._name, level: this._level });
    }
    get trace() {
        return this._logFn[Level.Trace];
    }
    get debug() {
        return this._logFn[Level.Debug];
    }
    get info() {
        return this._logFn[Level.Info];
    }
    get warn() {
        return this._logFn[Level.Warn];
    }
    get error() {
        return this._logFn[Level.Error];
    }
    setLevel({ level }) {
        this._level = level;
        this._logFnFactory({ name: this._name, level: this._level });
        this._logFn[Level.Info](`Change log level to ${levelToName[level]}`);
    }
    _logFnFactory({ name, level }) {
        Object.values(Level).forEach((value) => {
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
ConsoleLogger.Level = Level;
export default ConsoleLogger;
