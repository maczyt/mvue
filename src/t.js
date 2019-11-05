import MVue from './index';

window.vm = new MVue({
    data() {
        return {
            count: 1,
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