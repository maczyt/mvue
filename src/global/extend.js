import { mergeOptions } from "../utils";

/**
 * 
 * @param {*} options 
 */
export default function extend(options = {}) {
    const MVue = this;
    const _options = mergeOptions(MVue.options, options);    
    class SubMVue extends MVue {
        constructor(options) {
            super(options);
        }
    }
    SubMVue.options = _options;
    return SubMVue;
}