import { mergeOptions } from '../utils';

let uid = 0;
function init(options) {
    this.$el = null;
    this.$parent = options.parent;
    if (this.$parent) {
        // 父子组件建立联系
        this.$parent.$children.push(this);
    }
    this.$children = [];
    // 根节点，插件实例就只需要绑定到根节点即可
    this.$root = this.$parent
        ? this.$parent.$root
        : this;
    
    // 属性
    this._isMVue = true;
    this._uid = uid ++;

    this._events = [];
    this._directives = [];

    // 合并参数
    options = this.$options = mergeOptions(
        this.constructor.options,
        options,
        this
    );
    this._initMixins();
    this._callHook('beforeCreate');
    this._initState();
    this._callHook('created');
    if (options.el) {
        this.$compile();
    }
}

// 组件mixins
function initMixins() {
    if (this.$options.mixins) {
        const options = this.$options;
        this.$options = mergeOptions(options, options.mixins);
    }
}

export default {
    _init: init,
    _initMixins: initMixins,
};