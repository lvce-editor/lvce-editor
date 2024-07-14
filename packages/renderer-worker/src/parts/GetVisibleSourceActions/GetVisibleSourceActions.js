export const getVisibleSourceActions = (sourceActions, focusedIndex) => {
  const visible = []
  for (let i = 0; i < sourceActions.length; i++) {
    const isFocused = i === focusedIndex
    const sourceAction = sourceActions[i]
    visible.push({
      ...sourceAction,
      isFocused,
    })
  }
  return visible
}
