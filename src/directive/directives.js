import { off, on } from "../utils";
import modelDirective from './model';
import forDirective from './for';
import componentDirective from './component';

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
    },

    // v-html
    html: {
        update(value) {
            this.el.innerHTML = value;
        }
    },

    // v-show
    show: {
        update(value) {
            this.el.style.display = !!value ? '' : 'none';
        }
    },

    // v-bind
    bind: {
        priority: PRIORITY.bind,
        bind() {
            // 要bind的attr属性名
            this.attr = this.descriptor.arg;
        },
        update(value) {
            // 直接写成设置attr
            this.el.setAttribute(this.attr, value);
            // 父子组件传参待补充
        }
    },

    // v-model
    model: {
        priority: PRIORITY.model,
        ...modelDirective,
    },

    // v-for
    for: {
        priority: PRIORITY.for,
        ...forDirective,
    },

    // v-component 不对外暴露
    component: {
        priority: PRIORITY.component,
        ...componentDirective,
    }
}