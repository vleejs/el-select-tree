export function each(data, callback, childName = 'children') {
  let current, children

  for (let i = 0, len = data.length; i < len; i++) {
    current = data[i]
    children = []
    if (current[childName] && current[childName].length > 0) {
      children = current[childName]
    }
    callback && callback(current, children)
    if (children.length > 0) {
      each(children, callback, childName)
    }
  }
}

export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()
export function getTreeData(data, id = 'id', val = '', name = 'name', children = 'children', isRow = false) {
  let arr = []
  each(
    data,
    (item) => {
      if (item[id] === val) {
        arr.push(item)
      }
    },
    children
  )
  return arr.length > 0 ? (isRow ? arr : arr[0][name]) : null
}
