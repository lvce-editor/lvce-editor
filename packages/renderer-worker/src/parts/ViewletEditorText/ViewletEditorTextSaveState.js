export const saveState = (state) => {
  const { selections, focused, deltaY, minLineY, differences } = state
  return {
    selections: Array.from(selections),
    focused,
    deltaY,
  }
}
