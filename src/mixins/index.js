export { default as init } from './init';
export { default as state } from './state';
export { default as lifecycle } from './lifecycle';
export { default as render } from './render';

export default function mixins(list) {
    return function(target) {
        Object.assign(target.prototype, ...list);
    }
}