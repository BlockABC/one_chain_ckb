import { LoggerHolder } from './LoggerHolder'
import { ILogger } from './interface'
import { Level } from './const'

/**
 * Logger
 */
export class Logger implements ILogger {
  protected _logger: ILogger
  protected _name: string
  protected _level: Level

  get trace (): (message: any, ...args: any[]) => void {
    return this._logger.trace
  }

  get debug (): (message: any, ...args: any[]) => void {
    return this._logger.debug
  }

  get info (): (message: any, ...args: any[]) => void {
    return this._logger.info
  }

  get warn (): (message: any, ...args: any[]) => void {
    return this._logger.warn
  }

  get error (): (message: any, ...args: any[]) => void {
    return this._logger.error
  }

  constructor ({ logger, name = '', level = Level.Info }: { logger: ILogger, name?: string, level?: Level }) {
    this._logger = logger
    this._name = name
    this._level = level

    this._logger.setLevel({ level: this._level })
  }

  /**
   * Set logger
   *
   * @param logger
   */
  setLogger ({ logger }: { logger: ILogger }): void {
    this._logger = logger
  }

  setLevel ({ level }: { level: string | Level }): void {
    this._logger.setLevel({ level })
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
  extend ({ logger, name = '', level = Level.Info }: { logger: ILogger, name?: string, level?: Level }): Logger {
    return new Logger({ logger, name, level })
  }
}

export const logger = new Logger({ logger: new LoggerHolder() })
