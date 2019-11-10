import mixin from './mixin';
import extend from './extend';
import { nextTick } from '../observer/scheduler';
import use from './use';

export function useGlobal(MVue) {
    MVue.mixin = mixin;
    MVue.extend = extend;
    MVue.use = use;

    MVue.nextTick = nextTick;
};

