import { LoggerHolder } from './LoggerHolder';
import { Level } from './const';
/**
 * Logger
 */
export class Logger {
    constructor({ logger, name = '', level = Level.Info }) {
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
    extend({ logger, name = '', level = Level.Info }) {
        return new Logger({ logger, name, level });
    }
}
export const logger = new Logger({ logger: new LoggerHolder() });
