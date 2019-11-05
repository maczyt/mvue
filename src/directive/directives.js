import { off, on } from "../utils";

// 指令优先级
const PRIORITY = {
    on: 700,
    model: 800,
    bind: 850,
    component: 1500,
    if: 2100,
    for: 2200,
    slot: 2300,
};

export default {
    // v-text处理
    text: {
        bind() {
            this.attr = 
                this.el.nodeType === 3 ? 'data' : 'textContent';
        },
        update(value) {
            this.el[this.attr] = value;
        }
    },

    // v-on
    on: {
        priority: PRIORITY.on,
        update(handler) {
            const { el, descriptor } = this;
            if (this.handler) {
                off(el, descriptor.arg, this.handler);
            }
            this.handler = handler;
            on(el, descriptor.arg, this.handler);
        },
        unbind() {
            if (this.handler) {
                off(this.el, this.descriptor.arg, this.handler);
            }
        }
    }
}