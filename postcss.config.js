module.exports = {
  plugins: {
    'postcss-salad': {
      browsers: ['ie > 8', 'last 2 versions'],
      features: {
        bem: {
          // bem 原指 block element modifier 这里的b就是组件 e就是后代，组件内的slot, modifier还是修饰符的意思
          shortcuts: {
            component: 'b',
            modifier: 'm',
            descendent: 'e'
          },
          // 后代用__连接  modifier用--连接
          separators: {
            descendent: '__',
            modifier: '--'
          }
        }
      }
    }
  }
};
