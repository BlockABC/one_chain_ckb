import { log, LoggerHolder } from '@onechain/core'

export const logger: log.Logger = log.logger.extend({ logger: new LoggerHolder() })
