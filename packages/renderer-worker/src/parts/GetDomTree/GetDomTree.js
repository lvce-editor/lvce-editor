export const getDomTree = (dom) => {
  if (dom.length === 0) {
    return {
      type: 'root',
      children: [],
    }
  }
  const max = dom.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = dom[i]
    element.children ||= []
    if (element.childCount > 0) {
      element.children.push(...stack.slice(0, element.childCount))
      stack = stack.slice(element.childCount)
    }
    stack.unshift(element)
  }
  return {
    type: 'root',
    children: [stack[0]],
  }
}
