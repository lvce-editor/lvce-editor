export const focus = async (state) => {
  const { focused } = state
  if (focused) {
    return state
  }
  return {
    ...state,
    focused: true,
  }
}
