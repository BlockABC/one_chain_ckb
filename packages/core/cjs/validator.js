"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const error_1 = require("./error");
/**
 * Validator
 */
class Validator {
    constructor() {
        this._rules = new Map();
    }
    get rules() {
        return this._rules;
    }
    /**
     * Add rule
     *
     * @param {string} name
     * @param {ruleFn} validator
     */
    addRule(name, validator) {
        this._rules.set(name, validator);
    }
    /**
     * Add rules
     *
     * @param {[name: string]: validateFn} rules
     */
    addRules(rules) {
        for (const name of Object.keys(rules)) {
            this.addRule(name, rules[name]);
        }
    }
    /**
     * Remove rule
     *
     * @param {string} name
     */
    removeRule(name) {
        this._rules.delete(name);
    }
    /**
     * Validate value with rule
     *
     * @param {string} ruleName
     * @param {string} paramName
     * @param {any} value
     */
    validate(ruleName, paramName, value) {
        if (!this._rules.has(ruleName)) {
            throw new Error(`Rule ${ruleName} is not defined!`);
        }
        const validate = this._rules.get(ruleName);
        validate(paramName, value, this._refer(ruleName));
    }
    /**
     * Extend validator
     *
     * @param { [name: string]: validateFn } rules
     * @returns {Validator}
     */
    extend(rules) {
        const inst = new Validator();
        this.rules.forEach((validator, name) => {
            inst.addRule(name, validator);
        });
        for (const name of Object.keys(rules)) {
            inst.addRule(name, rules[name]);
        }
        return inst;
    }
    /**
     * Refer other rule
     *
     * @param forbiddenRuleName
     * @returns {validateFn}
     * @private
     */
    _refer(forbiddenRuleName) {
        return (ruleName, paramName, value) => {
            if (ruleName === forbiddenRuleName) {
                throw new Error('Can not refer to the same rule!');
            }
            this.validate(ruleName, paramName, value);
        };
    }
}
exports.Validator = Validator;
exports.validator = new Validator();
exports.validator.addRules({
    'rpcnode': function (name, value) {
        if (typeof value.chainId !== 'string' || !value.chainId) {
            throw error_1.ParamError.fromCode(100, name);
        }
        if (typeof value.chainType !== 'string' || !value.chainType) {
            throw error_1.ParamError.fromCode(101, name);
        }
        if (typeof value.baseUrl !== 'string' || !value.baseUrl) {
            throw error_1.ParamError.fromCode(102, name);
        }
    },
    'value': function (name, value) {
        if (typeof value === 'number') {
            if (value < 0 || value > Number.MAX_SAFE_INTEGER) {
                throw error_1.ParamError.fromCode(300, name);
            }
        }
        else {
            value = new decimal_js_1.default(value);
            if (value.lt(0)) {
                throw error_1.ParamError.fromCode(301, name);
            }
        }
    }
});
/**
 * Decorator factory
 *
 * @param validator
 * @returns {(...rules: any) => Function}
 */
function params(validator) {
    /**
     * Use for function like: (a, b, c) => any
     */
    return function params(...rules) {
        return function (target, method, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                for (let i = 0; i < rules.length; i++) {
                    if (rules[i] == null) {
                        continue;
                    }
                    validator.validate(rules[i], `Param[${i}]`, args[i]);
                }
                return originalMethod.apply(this, args);
            };
        };
    };
}
exports.params = params;
/**
 * Decorator factory
 *
 * @param validator
 * @returns {(rules: any) => Function}
 */
function objParams(validator) {
    /**
     * Use for function like: ({a, b, c}) => any
     */
    return function objParams(rules) {
        return function (target, method, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (args) {
                for (const key of Object.keys(rules)) {
                    validator.validate(rules[key], `Param[${key}]`, args[key]);
                }
                return originalMethod.call(this, args);
            };
        };
    };
}
exports.objParams = objParams;
