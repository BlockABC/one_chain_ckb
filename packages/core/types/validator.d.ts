export declare type ruleFn = (name: string, value: any, refer: validateFn) => void;
export declare type validateFn = (ruleName: string, paramName: string, value: any) => void;
/**
 * Validator
 */
export declare class Validator {
    protected _rules: Map<string, Function>;
    get rules(): Map<string, Function>;
    /**
     * Add rule
     *
     * @param {string} name
     * @param {ruleFn} validator
     */
    addRule(name: string, validator: ruleFn): void;
    /**
     * Add rules
     *
     * @param {[name: string]: validateFn} rules
     */
    addRules(rules: {
        [name: string]: ruleFn;
    }): void;
    /**
     * Remove rule
     *
     * @param {string} name
     */
    removeRule(name: string): void;
    /**
     * Validate value with rule
     *
     * @param {string} ruleName
     * @param {string} paramName
     * @param {any} value
     */
    validate(ruleName: string, paramName: string, value: any): void;
    /**
     * Extend validator
     *
     * @param { [name: string]: validateFn } rules
     * @returns {Validator}
     */
    extend(rules: {
        [name: string]: ruleFn;
    }): Validator;
    /**
     * Refer other rule
     *
     * @param forbiddenRuleName
     * @returns {validateFn}
     * @private
     */
    protected _refer(forbiddenRuleName: any): (ruleName: string, paramName: string, value: any) => void;
}
export declare const validator: Validator;
/**
 * Decorator factory
 *
 * @param validator
 * @returns {(...rules: any) => Function}
 */
export declare function params(validator: any): Function;
/**
 * Decorator factory
 *
 * @param validator
 * @returns {(rules: any) => Function}
 */
export declare function objParams(validator: any): Function;
