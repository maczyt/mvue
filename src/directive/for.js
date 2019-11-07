import { compile } from "../compile";
import { RE, makeGetterFn } from "../utils";

// Vue官方的v-for很强大，支持Array | Object | number | string | Iterable (2.6 新增)
// 我们就支持Array就行了，其它其实都是同理的 v-for="(item, index) in arr"
export default {
    bind() {
        const expRE = /(.*) in (.*)/;
        try {
            const match = this.expression.match(expRE);
            const indexAndValue = match[1].trim().slice(1, -1).split(',');
            this.indexKey = indexAndValue[1].trim();
            this.valueKey = indexAndValue[0].trim();
            this.expression = match[2].trim();         
            
            // 占位元素
            this.anchorStart = document.createComment('v-for-start');
            this.anchorEnd = document.createComment('v-for-end');
            this.frag = document.createDocumentFragment();
            this.el.replaceWith(this.anchorEnd);
            this.anchorEnd.parentElement.insertBefore(this.anchorStart, this.anchorEnd);
        } catch(e) {
            throw new Error('v-for should (item, index) in arr');
        }
    },
    update(value) {
        // 清除旧的list
        while (this.len) {
            this.anchorEnd.previousElementSibling.remove();
            this.len --;
        }

        let html;
        let cloneNode;
        this.len = value.length;
        value.forEach((item, index) => {
            cloneNode = this.el.cloneNode(true);
            html = cloneNode.innerHTML;
            html = html.replace(RE.template, (_, t) => {
                return makeGetterFn(t).call({ item, index });
            });
            cloneNode.innerHTML = html;
            this.frag.appendChild(cloneNode);
        });
        compile(this.vm, this.frag, true);
        this.anchorEnd.parentElement.insertBefore(this.frag, this.anchorEnd);
    }
}