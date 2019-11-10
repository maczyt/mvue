import mixin from './mixin';
import extend from './extend';
import { nextTick } from '../observer/scheduler';
import use from './use';
import component from './component';

export function useGlobal(MVue) {
    MVue.mixin = mixin;
    MVue.extend = extend;
    MVue.use = use;
    MVue.component = component;

    MVue.nextTick = nextTick;
};

