import MVue from './index';

window.vm = new MVue({
    data() {
        return {
            count: 1,
            htmlData: `
                <h1>Hello MVue</h1>
            `,
            showFalse: false,
            showTrue: true,
            name: 'yutao'
        }
    },
    methods: {
        increment() {
            this.count ++;
        },
        decrement() {
            this.count --;
        }
    },
    el: '#app',
});

if (module.hot) {
    module.hot.accept();
}