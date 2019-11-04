// 生命周期钩子
function callHook(hook) {
    console.log(hook);
    const handlers = this.$options[hook];
    [].concat(handlers).filter(Boolean).forEach(handle => {
        handle.call(this);
    });
}

export default {
    _callHook: callHook,
}
