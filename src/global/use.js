export default function use(plugin, ...args) {
    const MVue = this;
    args.unshift(MVue);
    // 插件已使用
    if (plugin.installed) return;
    
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
    } else {
        plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
}