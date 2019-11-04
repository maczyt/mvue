import { hasOwn } from ".";

function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
}
const strats = Object.create(null);

/**
 * 合并options的mixins/directives等
 * @param {*} parent 
 * @param {*} child 
 * @param {*} vm 
 */
export function mergeOptions(parent, child, vm) {
    guardComponents(child);

    // 暂不支持mixins、extends

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
 * 处理组件components对象
 * @param {*} options 
 */
function guardComponents(options) {
    if (options.components) {
        const components = options.components;
        Object.keys(components).forEach(key => {
            // MVue
        })
    }
}