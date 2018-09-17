<template>
  <!-- loading时disable 或者props是disable 或者 elForm.disable为真 -->
  <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      // 各种按钮对应的样式
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <!-- icon在loading中时不显示 即loading时在原来icon的地方加上菊花图 -->
    <i :class="icon" v-if="icon && !loading"></i>
    <!-- 存在插入插槽的元素才显示 -->
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'ElButton',

    // 依赖注入 和form formitem有关
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      // 按钮的原生type类型 button / submit / reset
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      // 是否自动聚焦
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },

    computed: {
      // elFormItem上统一设置的尺寸。 先做这个假设
      _elFormItemSize() {
        // 短路运算的一种，如果this,elFormItem是假值，就用空对象调用,防止undefined.xxx报错， 不过依赖注入进来的值是有默认值的，应该不会出现为假，那这里是为什么呢
        return (this.elFormItem || {}).elFormItemSize;
      },
      // 按钮的尺寸
      buttonSize() {
        // 优先级，自己的size， elFormItem的size， 全局设置的size
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {
        // 自己 > elForm  禁用
        return this.disabled || (this.elForm || {}).disabled;
      }
    },

    methods: {
      // 对click事件做一层封装
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
