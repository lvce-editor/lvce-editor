export const findFileReferences = (state) => {
  const { groups, activeGroupIndex } = state
  if (activeGroupIndex === -1) {
    return state
  }
  const group = groups[activeGroupIndex]
  const { activeIndex } = group
  const editor = group.editors[activeIndex]
  const uri = editor.uri
  // TODO show references view
  console.log('show refrences', uri)
  return state
}
