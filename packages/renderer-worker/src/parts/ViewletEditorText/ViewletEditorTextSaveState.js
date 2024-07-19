export const saveState = (state) => {
  // @ts-ignore
  const { selections, focused, deltaY, minLineY, differences } = state
  return {
    selections: Array.from(selections),
    focused,
    deltaY,
  }
}
