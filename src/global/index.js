import mixin from './mixin';

export function useGlobal(MVue) {
    MVue.mixin = mixin;
};

