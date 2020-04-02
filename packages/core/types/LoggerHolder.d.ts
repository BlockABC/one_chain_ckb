import { ILogger } from './interface';
import { Level } from './const';
export declare class LoggerHolder implements ILogger {
    setLevel({ level }: {
        level: string | Level;
    }): void;
    trace(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    fatal?(message: string, ...args: any[]): void;
}
export default LoggerHolder;
