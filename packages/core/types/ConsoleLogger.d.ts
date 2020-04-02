import { ILogger } from './interface';
import { Level } from './const';
export declare class ConsoleLogger implements ILogger {
    static Level: typeof Level;
    protected _name: string;
    protected _level: Level;
    protected _logFn: {
        0: (message: any, ...args: any[]) => void;
        1: (message: any, ...args: any[]) => void;
        2: (message: any, ...args: any[]) => void;
        3: (message: any, ...args: any[]) => void;
        4: (message: any, ...args: any[]) => void;
    };
    constructor({ name, level }: {
        name: string;
        level: Level;
    });
    get trace(): (message: any, ...args: any[]) => void;
    get debug(): (message: any, ...args: any[]) => void;
    get info(): (message: any, ...args: any[]) => void;
    get warn(): (message: any, ...args: any[]) => void;
    get error(): (message: any, ...args: any[]) => void;
    setLevel({ level }: {
        level: Level;
    }): void;
    protected _logFnFactory({ name, level }: {
        name: string;
        level: Level;
    }): void;
}
export default ConsoleLogger;
