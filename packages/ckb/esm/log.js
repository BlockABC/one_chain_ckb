import { log, LoggerHolder } from '@onechain/core';
export const logger = log.logger.extend({ logger: new LoggerHolder() });
