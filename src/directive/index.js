import { getIn, extend } from "../utils";
import Watcher from "../observer/watcher";

export default class Directive {
  constructor(descriptor, vm) {
    this.vm = vm;
    this.descriptor = descriptor;
    Object.assign(
      this,
      getIn(descriptor, ["name", "expression", "el", "filters", "modifiers"])
    );
  }

  _bind() {
    const { descriptor } = this;
    const { def } = descriptor;
    if (typeof def === "function") {
      this.update = def;
    } else {
      extend(this, def);
    }

    // 具体指令继承来的bind方法
    if (this.bind) {
      this.bind();
    }

    if (this.expression) {
      const dir = this;
      if (this.update) {
        // 暴露出去的update方法 new Watcher的callback参数
        this._update = function(value, oldVal) {
          dir.update(value, oldVal);
        };
      }
      const watcher = (this._watcher = new Watcher(
        this.vm,
        this.expression,
        this._update,
        {
          filters: this.filters
        }
      ));

      // 第一次更新渲染
      if (this.update) {
        this.update(watcher.value);
      }
    }
  }

  // 废弃
  _teardown(i) {
    if (this.unbind) {
        this.unbind()
    }
    if (this._watcher) {
        this._watcher.teardown()
    }
    this.vm = this.el = this._watcher = null
  }

  set(value) {
      this._watcher.set(value);
  }
}
