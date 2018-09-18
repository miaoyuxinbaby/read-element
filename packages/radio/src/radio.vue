<template>
  <!-- 样式不愧是ui框架的灵魂，我的css太抠脚了 最后再来阅读样式吧 -->
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <!-- role和aria是为不方便人士提供的功能 -->
    <!-- tabindex是指定tab按键顺序的 -->
    <!-- model = isDisabled ? model : label 这句 isDisabled 为真，model = model 否则 model = label 就是说，在获得焦点时按空格，未选中则选中，选中还是选中 -->
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner"></span>
      <!-- 原来:value 和 v-model可以一起用。。。学到了 -->
      <input
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <!-- slot的默认值 -->
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElRadio',

    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElRadio',

    props: {
      value: {},
      // label是传入给radio的value
      label: {},
      disabled: Boolean,
      // 表单的name
      name: String,
      border: Boolean,
      size: String
    },

    data() {
      return {
        focus: false
      };
    },
    computed: {
      // 父组件中存在ElRadioGroup则为true
      isGroup() {
        let parent = this.$parent;
        // parent不存在是终止条件
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      // 第一次把接收到的label :value给了input 然后 input 的 v-model 就接管了这个状态 当然了，因为是:value， 所以当prop改变的时候，还是会触发v-model的
      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {
            // 当修改model的时候，会派发一个自定义的input事件
            this.$emit('input', val);
          }
        }
      },
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      radioSize() {
        const temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize;
      },
      // group存在与否 不同的优先级判断是否disable
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      },
      // 这里换行会易读一些，回头提个pr吧
      tabIndex() {
        return !this.isDisabled 
          ? (this.isGroup 
            ? (this.model === this.label 
              ? 0 
              : -1) 
            : 0) 
          : -1;
      }
    },

    methods: {
      // 派发change事件
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model);
          // 短路运算
          this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model);
        });
      }
    }
  };
</script>
