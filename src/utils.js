export const TypeOf = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

export const isSelectTag = (element) => {
  if (element.nodeType === Node.ELEMENT_NODE) {
    return element.tagName === 'SELECT'
  }

  return false;
};