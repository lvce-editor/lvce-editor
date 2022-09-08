export const focus = (state) => {
  if (state.focused) {
    return state
  }
  return {
    ...state,
    focused: true,
  }
}
