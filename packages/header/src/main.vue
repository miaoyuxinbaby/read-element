<template>
  <header class="el-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'ElHeader',

    componentName: 'ElHeader',

    props: {
      // 传了个高度
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
