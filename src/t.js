import MVue from './index';

const Sub = MVue.extend({
    data() {
        return {
            name: 'sss',
        }
    }
});

window.subVm = new Sub({
    data() {
        return {
            age: 24,
        }
    }
})

// console.log('Sub', Sub);

window.vm = new MVue({
    data() {
        return {
            count: 1,
            htmlData: `
                <h1>Hello MVue</h1>
            `,
            showFalse: false,
            showTrue: true,
            name: 'yutao',
            list: [1,2,3,4,5],
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