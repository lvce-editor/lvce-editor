export const MINIMUM_SLIDER_SIZE = 20

export const getListHeight = (state) => {
  const { height, headerHeight } = state
  return height - headerHeight
}
