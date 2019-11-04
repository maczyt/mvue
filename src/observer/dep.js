let uid = 0;
// 发布者
export default class Dep {
    constructor() {
        this.id = uid ++;
        this.subs = [];
    }
    // 绑定实例到当前订阅者
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    // 添加订阅者
    addSub(sub) {
        this.subs.push(sub);
    }
    // 取消订阅者
    removeSub(sub) {
        this.subs.splice(
            this.subs.indexOf(sub) >>> 0,
            1
        );
    }
    // 通知订阅者，约定订阅者提供update方法
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
// 用来绑定watcher
Dep.target = null;