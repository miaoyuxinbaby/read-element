// 是否定义过
export function isDef(val) {
  return val !== undefined && val !== null;
}
// 判断是否是韩语
export function isKorean(text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}
