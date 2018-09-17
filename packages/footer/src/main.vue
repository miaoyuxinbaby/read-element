<template>
  <footer class="el-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'ElFooter',

    componentName: 'ElFooter',

    props: {
      // 高度
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
