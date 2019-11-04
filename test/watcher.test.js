import Watcher from "../src/observer/watcher";
import observe from '../src/observer';

// 伪造MVue实例
const vm = {
    name: 'yutao',
    age: 24,
    _watchers: [],
};
observe(vm);

describe('Watcher test task', () => {
    it('method get, 会返回该watcher绑定的exp的值', () => {
        const cb = jest.fn();
        const watcher = new Watcher(vm, '`name:${name},age:${age}`', cb, {});
        expect(watcher.get()).toEqual('name:yutao,age:24');
    });

    it('method set, 会触发callback', () => {
        const cb = jest.fn();
        const watcher = new Watcher(vm, '`name:${name},age:${age}`', cb, { sync: true });
        vm.name = 'Mr. yutao';
        expect(cb).toHaveBeenCalledTimes(1);
        expect(watcher.get()).toEqual('name:Mr. yutao,age:24')
    });
});