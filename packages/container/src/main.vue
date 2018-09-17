<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <!-- container header aside footer 都配备了slot -->
    <slot></slot>
  </section>
</template>

<script>
  export default {
    name: 'ElContainer',

    componentName: 'ElContainer',

    props: {
      direction: String
    },

    computed: {
      isVertical() {
        // 是否是垂直排列手动传值
        if (this.direction === 'vertical') {
          return true;
        } else if (this.direction === 'horizontal') {
          return false;
        }
        // 自动判断（默认值）
        // 可以从 this.$slots 获取 VNodes 列表中的静态内容
        // default 属性包括了所有没有被包含在具名插槽中的节点。
        return this.$slots && this.$slots.default
          ? this.$slots.default.some(vnode => {
            // 子元素中有 el-header 或 el-footer 时为 vertical，否则为 horizontal
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === 'el-header' || tag === 'el-footer';
          })
          : false;
      }
    }
  };
</script>
