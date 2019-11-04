import mixins, { 
    init, 
    state, 
    lifecycle,
    render,
} from './mixins';
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

window.MVue = MVue;
export default MVue;