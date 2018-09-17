<template>
  <aside class="el-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'ElAside',

    componentName: 'ElAside',

    props: {
      // 传了个宽度
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
