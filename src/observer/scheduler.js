import { hasOwn } from "../utils";

const queue = [];
let has = Object.create(null);
let waiting = false;

export function pushWatcher(watcher) {
    const id = watcher.id;
    if (!hasOwn(has, id)) {
        has[id] = queue.length;
        queue.push(watcher);
    }

    if (!waiting) {
        waiting = true;
        nextTick(flushQueue);
    }
}

export function nextTick(cb, ctx) {
    Promise.resolve().then(() => {
        ctx ? cb.call(ctx) : cb();
    })
}

function flushQueue() {
    queue.forEach(w => {
        // 立即执行
        w.run();
    });

    waiting = false;
    has = Object.create(null);
    queue.length = 0;
}