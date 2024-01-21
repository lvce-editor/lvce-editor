export const getDomTree = (dom) => {
  if (dom.length === 0) {
    return {
      type: 'root',
      children: [],
    }
  }
  return {
    type: 'root',
    children: dom,
  }
}
