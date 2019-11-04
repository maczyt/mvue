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
    text: {
        bind() {
            this.attr = 
                this.el.nodeType === 3 ? 'data' : 'textContent';
        },
        update(value) {
            this.el[this.attr] = value;
        }
    }
}