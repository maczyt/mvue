import { query } from '../utils';
import { compile } from '../compile';

function $compile() {
    const { $options: options } = this;
    // 获取元素
    options.el = this.$el = query(options.el);
    // const temp = transclude(this.$el, options);
    // if (temp) {
        // this.$el.innerHTML = '';
        // this.$el.appendChild(temp);
    // }
    compile(this, this.$el);
}

function transclude(el, options) {
    if (options.template) {
        const template = options.template.trim();
        const node = document.createElement('div');
        node.innerHTML = template;
        let frag = extractContent(node, true);
        frag = frag.cloneNode(true);
        return frag.firstChild;
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