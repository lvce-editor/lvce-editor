export const focusNext = (state) => {
  const nextIndex =
    state.activeIndex === state.editors.length - 1 ? 0 : state.activeIndex + 1
  return focusIndex(state, nextIndex)
}
