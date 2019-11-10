import mixins, { 
    init, 
    state, 
    lifecycle,
    render,
} from './mixins';
import { useGlobal } from './global';
import directives from './directive/directives';

@mixins([
    init,
    state,
    lifecycle,
    render,
])
class MVue {
    constructor(options = {}) {
        this._init(options);
    }
}

MVue.options = {
    directives,
    components: {},
    filters: {},
};

// this is used to identify the "base" constructor to extend all plain-object
// components with in Weex's multi-instance scenarios.
// 来自Vue源码，不是很明白这么设置。
MVue.options._base = MVue;

useGlobal(MVue);
window.MVue = MVue;
export default MVue;