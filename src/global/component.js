export default function component(id, definition, isPrivate) {
    const self = this; // MVue or MVue instance
    if (!definition) {
        return self.options.components[id];
    } else {
        // definition is MVue options
        if (typeof definition === 'object') {
            definition.name = definition.name || id;
            // 变成subClass
            definition = self.options._base.extend(definition);
        }
        // definition is MVue extend's subClass
        // if (typeof definition === 'function') {
        //     definition = {
        //         bind: definition,
        //         update: definition,
        //     }
        // }
        if (!isPrivate) {
            // 组件内定义的不写入全局
            self.options.components[id] = definition;
        }
        return definition;
    }
}