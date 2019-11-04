import MVue from './index';

window.vm = new MVue({
    data() {
        return {
            count: 1,
        }
    },
    el: '#app',
});

if (module.hot) {
    module.hot.accept();
}