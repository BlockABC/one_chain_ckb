import { ILogger } from './interface';
import { Level } from './const';
/**
 * Logger
 */
export declare class Logger implements ILogger {
    protected _logger: ILogger;
    protected _name: string;
    protected _level: Level;
    get trace(): (message: any, ...args: any[]) => void;
    get debug(): (message: any, ...args: any[]) => void;
    get info(): (message: any, ...args: any[]) => void;
    get warn(): (message: any, ...args: any[]) => void;
    get error(): (message: any, ...args: any[]) => void;
    constructor({ logger, name, level }: {
        logger: ILogger;
        name?: string;
        level?: Level;
    });
    /**
     * Set logger
     *
     * @param logger
     */
    setLogger({ logger }: {
        logger: ILogger;
    }): void;
    setLevel({ level }: {
        level: string | Level;
    }): void;
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
    extend({ logger, name, level }: {
        logger: ILogger;
        name?: string;
        level?: Level;
    }): Logger;
}
export declare const logger: Logger;
