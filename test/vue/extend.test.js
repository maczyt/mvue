import Vue from 'vue';

describe('Vue extend test', () => {
    it('extend options', () => {
        const SubVue = Vue.extend({
            data() {
                return {
                    name: 'yutao',
                }
            }
        });
        const vm = new SubVue({
            data() {
                return {
                    age: 24
                }
            }
        });
        expect(vm.name).toEqual('yutao');
        expect(vm.age).toEqual(24);
    });
});