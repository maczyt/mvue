import mixin from './mixin';
import extend from './extend';
import { nextTick } from '../observer/scheduler';

export function useGlobal(MVue) {
    MVue.mixin = mixin;
    MVue.extend = extend;
    


    MVue.nextTick = nextTick;
};

