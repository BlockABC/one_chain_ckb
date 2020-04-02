"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
class LoggerHolder {
    setLevel({ level }) { }
    trace(message, ...args) { }
    debug(message, ...args) { }
    info(message, ...args) { }
    warn(message, ...args) { }
    error(message, ...args) { }
    fatal(message, ...args) { }
}
exports.LoggerHolder = LoggerHolder;
exports.default = LoggerHolder;
