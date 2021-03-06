import { hasOwn, isObject, toArray } from ".";

function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
}
const strats = {
    data(parentVal, childVal, vm) {
        // 全局merge
        if (!vm) {
            if (!childVal) {
                return parentVal;
            }
            if (!parentVal) {
                return childVal;
            }

            return function mergeDataFn() {
                return mergeData(parentVal.call(this), childVal.call(this));
            }
        } else if (parentVal || childVal) {
        // 组件merge
            return function mergeDataFn() {
                const oldData = typeof parentVal === 'function' 
                    ? parentVal.call(vm) : void 0;
                const data = childVal.call(vm);
                return mergeData(oldData, data);
            }
        }
    }
};

/**
 * 合并options的mixins/directives等
 * @param {*} parent 
 * @param {*} child 
 * @param {*} vm 
 */
export function mergeOptions(parent, child, vm) {
    // 对象组件化
    guardComponents(child, vm);

    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }

    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        // for mixins/extends
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
    }

    return options;
}
/**
 * 合并attrs
 * @param {*} fromNode 
 * @param {*} toNode 
 */
export function mergeAttrs(fromNode, toNode) {
    const attrs = fromNode.attributes;
    let name, value;
    toArray(attrs).forEach(attr => {
        name = attr.name;
        value = attr.value;
        if (name === 'class') {
            toNode.classList.add(value);
        }  else {
            toNode.setAttribute(name, value);
        }
    });
}

/**
 * 合并data
 * @param {*} from 
 * @param {*} to 
 */
function mergeData(from, to) {
    let key, toVal, fromVal;
    for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        } else if (isObject(toVal) && isObject(fromVal)) {
            mergeData(fromVal, toVal);
        }
    }
    return to
}

/**
 * 处理组件components对象
 * @param {*} options 
 */
function guardComponents(options, vm) {
    if (options.components) {
        const components = options.components;
        Object.keys(components).forEach(key => {
            components[key] = vm.constructor.component(key, components[key], true);
        });
    }
}