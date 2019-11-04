import { def } from "../../utils";

const arrayProto = Array.prototype;
// 原型链: arrayMethods <- arrayProto
const arrayMethods = Object.create(arrayProto);

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach((method) => {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        const args = Array.from(arguments);
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }
        // update
        ob.dep.notify();
        return result;
    });
});

export default arrayMethods;