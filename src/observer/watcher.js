import { extend, makeGetterFn } from "../utils";
import Dep from './dep';
import { pushWatcher } from "./scheduler";

let uid = 0;
// 订阅者
// 一个exp可能会涉及多个state。如：name + age
// 每个state对应一个Dep。所以该watcher需要订阅多个Dep
export default class Watcher {
    constructor(vm, expOrFn, callback, options) {
        this.id = uid ++;
        // 收集到MVue实例到_watchers中
        vm._watchers.push(this);

        if (options) {
            extend(this, options);
        }
        this.vm = vm;
        this.expression = expOrFn;
        // <t :title="doc.title" @update:title="doc.title = $event"></t>
        // 等价于
        // <t :title.sync="doc.title"></t>
        this.sync = options ? options.sync : false;
        // 在“change”时而非“input”时更新 <input v-model.lazy="msg"></input>
        this.dirty = this.lazy;

        // 因为一个watcher会对应多个dep，所以也存储起来
        this.deps = [];
        this.depIds = [];
        this.cb = callback;

        // 解析exp，分析其有几个state
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
            this.setter = undefined;
        } else {
            const res = parseExpression(expOrFn);
            this.getter = res.get;
            this.setter = value => {
                // 这个有点问题...
                vm[expOrFn] = value;
            };
        }

        if (this.lazy) {
            // expOrFn的值
            this.value = undefined;
        } else {
            this.value = this.get();
        }
    }
    // 获取exp的值，其实就是触发exp上state的getter
    get() {
        const { vm } = this;
        Dep.target = this;
        let value;
        try {
            value = this.getter.call(vm, vm);
        } catch(e) {
            value = void 0;
        }

        if (this.filters) {
            // 过滤器处理
        }
        // 处理完毕
        Dep.target = null;
        return value;
    }

    set(value) {
        this.setter.call(this.vm, value);
    }

    update() {
        if (this.lazy) {
            this.dirty = true;
        } else if (!this.sync) {
            pushWatcher(this);
        } else {
            // 立即、同步执行
            this.run();
        }
    }

    run() {
        const value = this.get();
        const oldValue = this.value;
        this.value = value;
        if (value !== oldValue || typeof value === 'object') {
            this.cb.call(this.vm, value, oldValue);
        }
    }

    addDep(dep) {
        if (!this.depIds.includes(dep.id)) {
            this.deps.push(dep);
            this.depIds.push(dep.id);
            dep.addSub(this); // 依赖反向
        }
    }

    /* computed使用 start */
    evaluate() {
        const current = Dep.target;
        this.value = this.get();
        this.dirty = false;
        Dep.target = current;
    }
    depend() {
        this.deps.forEach(dep => {
            dep.depend();
        })
    }
    /* computed使用 end */
}

function parseExpression(exp) {
    exp = exp.trim();
    const res = { exp };
    res.get = makeGetterFn(exp);
    return res;
}
