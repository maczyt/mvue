import { RE, toArray, checkComponent } from "../utils";
import Directive from "../directive";
import { nextTick } from "../observer/scheduler";
// 存放指令的descriptor
const des = [];
let pending = false;

export function compile(vm, el, isFor=false) {
  // 如果没有使用v-for，则继续解析子节点
  if (!compileNode(el, vm)) {
    if (el.hasChildNodes()) {
      compileNodes(el.childNodes, vm);
    }
  }
  // 是否在处理中
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
    isFor || vm._callHook("mounted");
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

// 解析元素
function compileElement(node, vm) {
  const { $options: options } = vm;
  // 从MVue.options merge来的
  const directives = options.directives;
  const tag = node.tagName.toLowerCase();

  if (!RE.commonTag.test(tag) && !RE.reservedTag.test(tag)) {
    // 说明是一个自定义组件
    const keys = Object.keys(options.components);
    if (keys.some(key => checkComponent(key, tag))) {
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
    return compileElementAttrs(node, vm);
  }
}

// 编译处理元素的attrs
function compileElementAttrs(el, vm) {
  const {
    $options: { directives }
  } = vm;

  let matched;
  let isFor = false;
  let isRemove = false;
  const attrs = toArray(el.attributes);
  for (let attr of attrs) {
    const name = attr.name.trim();
    const value = attr.value.trim();
    if (RE.on.test(name)) {
      onAttr(name, value);
    } else if (RE.bind.test(name)) {
      bindAttr(name, value);
    } else if ((matched = name.match(RE.dirAttr))) {
      if (name === "v-text") {
        textAttr(name, value);
      } else {
        otherAttr(name, value, matched[1]);
      }
      if (name === "v-for") {
        isFor = true;
      }
    }
    if (isRemove) {
      el.removeAttribute(name);
      isRemove = false;
    }
  }
  return isFor;

  // 处理v-on:click或@click
  function onAttr(name, value) {
    isRemove = true;
    des.push({
      vm,
      el,
      name: "on",
      expression: value,
      def: directives.on,
      attr: name,
      arg: name.replace(RE.on, "")
    });
  }

  // 处理v-bind:foo或:foo
  function bindAttr(name, value) {
    isRemove = true;
    const descriptor = {
      vm,
      el,
      name: "bind",
      def: directives.bind,
      attr: name,
      arg: name.replace(RE.bind, "")
    };
    // 过滤器
    applyFilters(value, descriptor);
    des.push(descriptor);
  }

  // 单独处理v-text
  function textAttr(name, value) {
    isRemove = true;
    const descriptor = {
      vm,
      el,
      name: "text",
      def: directives.text,
      attr: name,
      arg: name.replace(RE.bind, "")
    };
    // 过滤器
    applyFilters(value, descriptor);
    des.push(descriptor);
  }

  // 处理其它指令
  function otherAttr(name, value, directiveName) {
    isRemove = true;
    des.push({
      vm,
      el,
      name: name.replace(/^v-/, ""),
      expression: value,
      def: directives[directiveName],
      attr: name,
      arg: void 0
    });
  }
}

// 解析文本节点
function compileTextNode(node, vm) {
  const tokens = parseText(node.nodeValue, vm);
  if (!tokens.length) return;
  const frag = document.createDocumentFragment();
  let el;
  for (let token of tokens) {
    el = token.template ? processTextToken(token, vm) : document.createTextNode(token.value);
    frag.appendChild(el);
    if (token.template) {
      des.push(token.descriptor);
    }
  }

  nextTick(() => {
    node.replaceWith(frag);
  });

  // 处理{{xxx}}
  // 就是文本节点使用了v-text指令
  function processTextToken(token, vm) {
    const {
      $options: { directives }
    } = vm;
    const el = document.createTextNode(" ");
    const descriptor = {
      vm, el,
      name: "text",
      def: directives.text,
    };
    applyFilters(token.value, descriptor);
    token.descriptor = descriptor;
    return el;
  }
}

// 解析文本->tokens
// 如: Count: {{ count }} -> ['Count', { name: count, def: text, ... }]
function parseText(text, vm) {
  let index = 0;
  let lastIndex = 0;
  let match;
  const tokens = [];
  while ((match = RE.template.exec(text))) {
    index = match.index;
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      });
    }
    // console.log('match', match);
    tokens.push({
      value: match[1],
      template: true
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    });
  }

  return tokens;
}

// utils
// 应用过滤器
function applyFilters(value, descriptor) {
  const values = value.split("|");
  if (values.length > 1) {
    descriptor.expression = values.shift();
    descriptor.filters = values.map(v => ({ name: v.trim() }));
  } else {
    descriptor.expression = value;
  }
}
