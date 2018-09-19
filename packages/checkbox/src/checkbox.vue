<template>
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    :id="id"
  >
    <span class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        // 这个样式不知道有什么用。。没看出来
        'is-focus': focus
      }"
       aria-checked="mixed"
    >
      <span class="el-checkbox__inner"></span>
      <!-- 设定了选中时和没选中时的值 -->
      <input
        v-if="trueLabel || falseLabel"
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <!-- 否则 用label维护值 -->
      <input
        v-else
        class="el-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <!-- 显示插槽内容或者label传值 -->
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElCheckbox',

    data() {
      // 有点复杂嘞、一开始蒙了，，在selfModel，stort,value,model,__checkboxGroup几个状态间懵逼
      return {
        selfModel: false,
        // 是否选中的状态值。 focus是赋值true，blur赋值false
        focus: false,
        isLimitExceeded: false
      };
    },

    computed: {
      // group时，model是store 并且value是undefined
      // 没有group包着时，要么用了v-model要么没用，用了就是this.value， 没用就默认是未选
      model: {
        get() {
          return this.isGroup
            ? this.store 
            : this.value !== undefined
              ? this.value 
              : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            // 最小最大选中数的限制
            this.isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true));

            // 通过验证派发事件给group组件
            this.isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val]);

            // 这个setter为什么没有赋值。。。
            // 不赋值的原因是，group模式下不需要赋值，没有维护属性
          } else {
            // 不是组就 赋值给selfModel 
            this.$emit('input', val);
            this.selfModel = val;
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },

      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            // 父组件如果存在组，则_checkboxGroup就是那个组
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },

      store() {
        // _checkboxGroup 是什么。。。
        // _checkboxGroup存在 则 store是父组件（那个group）的value，借用数据
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },

      isDisabled() {
        // 优先级 组 本身 from
        return this.isGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      },

      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },

      checkboxSize() {
        const temCheckboxSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        return this.isGroup
          ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
          : temCheckboxSize;
      }
    },

    props: {
      // v-model中绑定的值 
      // 如果是group value就是undefined, selfModel也永远是初始值，不会变化  
      // 在单个复选框使用时， value和selfModel是同步的
      // 单个复选框时， model其实就是value， 如果没v-model或者绑定value， 那就只有selfModel了
      value: {},
      label: {},
      indeterminate: Boolean,
      disabled: Boolean,
      // 当前是否勾选，在非group情况下决定selfModel的初始值
      checked: Boolean,
      name: String,

      trueLabel: [String, Number],
      falseLabel: [String, Number],
      id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
      border: Boolean,
      size: String
    },

    methods: {
      addToStore() {
        // 如果model是数组并且里面没有this.label push进去  是数组那肯定是有group
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          // else的话，肯定要么不是数组是单个的
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        if (this.isLimitExceeded) return;
        let value;
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel;
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel;
        }
        this.$emit('change', value, ev);
        this.$nextTick(() => {
          if (this.isGroup) {
            // 在父组件中可以接收change自定义事件
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
          }
        });
      }
    },

    created() {
      // 当前是勾选状态的话
      this.checked && this.addToStore();
    },
    mounted() { // 为indeterminate元素 添加aria-controls 属性
      // 不方便人士提供
      if (this.indeterminate) {
        this.$el.setAttribute('aria-controls', this.controls);
      }
    },

    watch: {
      // 值更新时派发给form一个change事件
      // 只有props传了value下来，value才会存在，但是文档上没有暴露value， 而是用的label。 所以，这里只会是v-model时触发
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', value);
      }
    }
  };
</script>
