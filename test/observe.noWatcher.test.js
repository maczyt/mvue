import observe from '../src/observer';
import Dep from '../src/observer/dep';

// 伪造Watcher
class Watcher {
    constructor(updator) {
        this.deps = [];
        this.update = updator;
    }
    addDep(dep) {
        this.deps.push(dep);
        dep.addSub(this);
    }
}

describe('observer test task', () => {
    test('普通属性、空不进行observe处理', () => {
        const matchs = [null, undefined, 1, '1', true];
        matchs.forEach(m => {
            expect(observe(m)).toBeUndefined();
        });
    });

    test('对象{ count: 0 }', () => {
        const value = { count: 0 };
        observe(value);
        const updator = jest.fn();
        Dep.target = new Watcher(updator);
        value.count++; // getter -> setter
        expect(updator).toHaveBeenCalledTimes(1);
    })
});
