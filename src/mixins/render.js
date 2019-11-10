import { query, mergeAttrs, replace } from '../utils';
import { compile } from '../compile';

function $compile() {
    const { $options: options } = this;
    // 获取元素
    options.el = this.$el = query(options.el);
    const temp = transclude(this.$el, options);
    if (temp) {
        this.$el = temp;
        options.el.innerHTML = '';
        replace(options.el, this.$el);
    }
    compile(this, this.$el);
}

/**
 * 处理template
 * @param {*} el 
 * @param {*} options 
 */
function transclude(el, options) {
    if (options.template) {
        const template = options.template.trim();
        const node = document.createElement('div');
        node.innerHTML = template;
        let frag = extractContent(node, true);
        frag = frag.cloneNode(true);
        const replacer = frag.firstChild;
        mergeAttrs(el, replacer);
        return replacer;
    }
}

function extractContent(el, asFragment) {
    let child, rawContent;
    if (el.hasChildNodes()) {
        rawContent = asFragment 
        ? document.createDocumentFragment() 
        : document.createElement('div');

        while (child = el.firstChild) {
            rawContent.appendChild(child);
        }
    }
    return rawContent;
}

export default {
    $compile,
}