export * from './merge';

export function noop() {}
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
export function extend(to, from) {
    return Object.assign(to, from);
}
export function makeGetterFn(body) {
    return new Function(`with(this) { return ${body} }`);
}
export function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}
export function getIn(obj, keys) {
    return keys.reduce((m, key) => (m[key] = obj[key], m), Object.create(null));
}

/* DOM */
export function query(selector) {
    return document.querySelector(selector);
}
/* /DOM */

export const toArray = Array.from;
export const RE = {
    on: /^(?:v-on:|@)/,
    bind: /^(?:v-bind:|:)/,
    dirAttr: /^v-([^:]+)(?:$|:(.*)$)/,
    template: /\{\{((?:.|\n)+?)\}\}/g,
    reservedTag: /^(slot|component)$/i,
    commonTag: /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer|button|textarea)$/i,
};