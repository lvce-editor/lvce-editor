export const getVirtualDomChildCount = (markdownDom) => {
  const max = markdownDom.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = markdownDom[i]
    if (element.childCount > 0) {
      stack = stack.slice(element.childCount)
    }
    stack.unshift(element)
  }
  return stack.length
}
