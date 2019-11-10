import { on, off, domValue } from "../utils";

const handlers = {
    // <input type="text" />
    text: {
        bind() {
            const self = this;
            this.listener = function() {
                // self: Directive
                // this: Element
                self.set(this.value);
            };
            // lazy -> change
            on(this.el, 'input', this.listener);
        },
        update(value) {
            this.el.value = domValue(value);
        },
        unbind() {
            off(this.el, 'input', this.listener);
        }
    },
    select: {},
    radio: {},
    checkbox: {},
};

export default {
    bind() {
        const el = this.el;
        const tag = el.tagName.toLowerCase();
        let handler;
        const handlerMap = new Map([
            ['input', handlers[el.type] || handlers.text],
            ['textarea', handlers.text],
            ['select', handlers.select],
        ]);
        if (handlerMap.has(tag)) {
            handler = handlerMap.get(tag);
            handler.bind.call(this);
            this.update = handler.update;
            this.unbind = handler.unbind;
        }
    }
}