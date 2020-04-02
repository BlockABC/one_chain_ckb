"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggerHolder_1 = require("./LoggerHolder");
const const_1 = require("./const");
/**
 * Logger
 */
class Logger {
    constructor({ logger, name = '', level = const_1.Level.Info }) {
        this._logger = logger;
        this._name = name;
        this._level = level;
        this._logger.setLevel({ level: this._level });
    }
    get trace() {
        return this._logger.trace;
    }
    get debug() {
        return this._logger.debug;
    }
    get info() {
        return this._logger.info;
    }
    get warn() {
        return this._logger.warn;
    }
    get error() {
        return this._logger.error;
    }
    /**
     * Set logger
     *
     * @param logger
     */
    setLogger({ logger }) {
        this._logger = logger;
    }
    setLevel({ level }) {
        this._logger.setLevel({ level });
    }
    /**
     * Extend Logger
     *
     * This will create new logger instance, avoid changing logger itself
     *
     * @param logger
     * @param name
     * @param level
     * @returns {Logger}
     */
    extend({ logger, name = '', level = const_1.Level.Info }) {
        return new Logger({ logger, name, level });
    }
}
exports.Logger = Logger;
exports.logger = new Logger({ logger: new LoggerHolder_1.LoggerHolder() });
