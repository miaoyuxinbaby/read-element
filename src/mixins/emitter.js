function broadcast(componentName, eventName, params) {

  // 触发vm的名为componentName的子组件里的 eventName和params 事件
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    // 递归
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    // 封装的dispatch API 向上派发
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      // 父组件存在 && （父组件的componentName不存在 || 父组件的componentName 不等于 接收的componentName）
      // 向上剖析出名字为componentName的父组件，找不到就退出
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      // 存在componentName则派发事件 parent肯定是存在，所以componentName不匹配时派发的事件其实是无用的
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    // 向下广播
    broadcast(componentName, eventName, params) {
      // mixin混入组件后，this指向vm
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
