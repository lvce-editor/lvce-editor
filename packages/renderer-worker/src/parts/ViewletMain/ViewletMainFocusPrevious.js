export const focusPrevious = (state) => {
  const previousIndex =
    state.activeIndex === 0 ? state.editors.length - 1 : state.activeIndex - 1
  return focusIndex(state, previousIndex)
}
