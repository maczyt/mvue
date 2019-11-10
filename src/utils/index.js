import camelCase from 'camel-case';

export * from './merge';

// 空函数
export function noop() {}
// 判断对象是否含有key属性
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
// 对象的合并
export function extend(to, from) {
    return Object.assign(to, from);
}
export function isObject(obj) {
    return typeof obj === 'object';
}
// 函数的上下文绑定
export function bind(fn, context) {
    return fn.bind(context ? context : this);
}
// 抛出一个getter
export function makeGetterFn(body) {
    return new Function(`with(this) { return ${body} }`);
}
// 定义对象的属性值
// 允许配置是否可枚举 比起简单的obj.key = value;
export function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}
// 对象的pick
export function getIn(obj, keys) {
    return keys.reduce((m, key) => (m[key] = obj[key], m), Object.create(null));
}

/* DOM */
export function query(selector) {
    return document.querySelector(selector);
}
export function on(el, eventName, callback, useCapture) {
    el.addEventListener(eventName, callback, useCapture);
}
export function off(el, eventName, callback) {
    el.removeEventListener(eventName, callback);
}
/* /DOM */

// 判断组件名是否一致 ref test/componentName.test.js
export function checkComponent(id1, id2) {
    return camelCase(id1) === camelCase(id2);
}

export const toArray = Array.from;
export const RE = {
    on: /^(?:v-on:|@)/,
    bind: /^(?:v-bind:|:)/,
    dirAttr: /^v-([^:]+)(?:$|:(.*)$)/,
    template: /\{\{((?:.|\n)+?)\}\}/g,
    reservedTag: /^(slot|component)$/i,
    commonTag: /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer|button|textarea)$/i,
};