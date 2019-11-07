import { mergeOptions } from "../utils";

export default function mixin(mx) {
    this.options = mergeOptions(this.options, mx);
}