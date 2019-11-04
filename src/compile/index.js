import { RE, toArray } from "../utils";
import Directive from "../directive";
// 存放指令的descriptor
const des = [];
let pending = false;

export function compile(vm, el) {
  // 如果没有使用v-for，则继续解析子节点
  if (!compileNode(el, vm)) {
    if (el.hasChildNodes()) {
      compileNodes(el.childNodes, vm);
    }
  }

  if (!pending) {
    pending = true;
    let dir, descriptor;
    while (des.length) {
        descriptor = des.shift();
        dir = new Directive(descriptor, vm);
        dir._bind(); // 指令绑定起来: 创建watcher去订阅dep
        descriptor.vm._directives.push(dir);
    }
    pending = false;
    vm._callHook('mounted');
  }
}

// ELEMENT_NODE: 1、TEXT_NODE: 3 其它节点不处理
function compileNode(node, vm) {
  const type = node.nodeType;
  // 便于扩展
  const compileMethods = new Map([[1, compileElement], [3, compileTextNode]]);
  return compileMethods.has(type) && compileMethods.get(type)(node, vm);
}
// compile 节点列表
function compileNodes(nodes, vm) {
  for (let node of nodes) {
    if (!compileNode(node, vm) && node.hasChildNodes()) {
      compileNodes(node.childNodes, vm);
    }
  }
}

function compileElement(node, vm) {
  const { $options: options } = vm;
  // 从MVue.options merge来的
  const directives = options.directives;
  const tag = node.tagName.toLowerCase();

  if (!RE.commonTag.test(tag) && !RE.reservedTag.test(tag)) {
    // 说明是一个自定义组件
    if (options.components[tag]) {
      // 这里其实可以增加判断: itemList、ItemList、item-list是相同的
      des.push({
        vm,
        el: node,
        name: "component",
        expression: tag,
        def: directives.component,
        modifiers: {}
      });
    }
  } else if (tag === "slot") {
    // slot组件
    des.push({
      vm,
      el: node,
      name: "slot",
      expression: "",
      def: directives.slot,
      arg: void 0,
      attr: void 0
    });
  } else if (node.hasAttributes()) {
    // 普通html 元素 && 元素上有属性
    let matched;
    let isFor = false;
    let isRemove = false;
    const attrs = toArray(node.attributes);
    for (let attr of attrs) {
      let { name, value } = attr;
      name = name.trim();
      value = value.trim();
      if (RE.on.test(name)) {
        isRemove = true;
        des.push({
          vm,
          el: node,
          name: "on",
          expression: value,
          def: directives.on,
          attr: name,
          arg: name.replace(RE.on, "")
        });
      } else if (RE.bind.test(name)) {
        isRemove = true;
        const values = value.split("|");
        const descriptor = {
          vm,
          el: node,
          name: "bind",
          def: directives.bind,
          attr: name,
          arg: name.replace(RE.bind, "")
        };
        if (values.length > 1) {
          const expression = values.shift();
          const filters = values.map(v => {
            return {
              name: v.trim()
            };
          });
          descriptor.expression = expression;
          descriptor.filters = filters;
        } else {
          descriptor.expression = value;
        }
        des.push(descriptor);
      } else if ((matched = name.match(RE.dirAttr))) {
        if (name.includes("v-text")) {
          isRemove = true;
          const values = value.split("|");
          const descriptor = {
            vm,
            el: node,
            name: "text",
            def: directives.text,
            attr: name,
            arg: name.replace(RE.bind, "")
          };
          if (values.length > 1) {
            descriptor.expression = values.shift();
            descriptor.filters = values.map(v => {
              return {
                name: v.trim()
              };
            });
          } else {
            descriptor.expression = value;
          }
          des.push(descriptor);
        } else if (!name.includes("v-else")) {
          isRemove = true;
          des.push({
            vm,
            el: node,
            name: name.replace(/^v-/, ""),
            expression: value,
            def: directives[matched[1]],
            attr: name,
            arg: void 0
          });
        }

        if (name.includes("v-for")) {
          isFor = true;
        }
      }
      if (isRemove) {
        node.removeAttribute(name);
        isRemove = false;
      }
    }
    return isFor;
  }
}

function compileTextNode(node, vm) {}
