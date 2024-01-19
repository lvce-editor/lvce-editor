export const handleScrollBarCaptureLost = (state) => {
  return {
    ...state,
    scrollBarActive: false,
  }
}
