import observe from '../observer';

function initProps() {
    console.log('init props');
}

function initMethods() {
    console.log('init methods');
}

function initData() {
    let data = this.$options.data || function() { return {} };
    if (typeof data !== 'function') {
        throw new TypeError('options data should be a function');
    }
    data = this._data = data();
    // data对象代理到vm上
    Object.keys(data).forEach(key => {
        this._proxy(this, '_data', key);
    });
    // 数据劫持
    observe(this._data);
}

function initComputed() {

}

function initWatch() {

}

function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function proxyGetter() {
            return this[sourceKey][key];
        },
        set: function proxySetter(val) {
            this[sourceKey][key] = val;
        }
    })
}

function initState() {
    this._watchers = []; // 实例订阅对象
    const options = this.$options;
    if (options.props) {
        initProps.call(this);
    }
    if (options.methods) {
        initMethods.call(this);
    }
    // 如果没有data配置，默认给一个空对象
    initData.call(this);
    if (options.computed) {
        initComputed.call(this);
    }
    if (options.watch) {
        initWatch.call(this);
    }
}

export default {
    _initState: initState,
    _proxy: proxy,
}