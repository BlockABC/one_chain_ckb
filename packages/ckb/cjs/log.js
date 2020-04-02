"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@onechain/core");
exports.logger = core_1.log.logger.extend({ logger: new core_1.LoggerHolder() });
