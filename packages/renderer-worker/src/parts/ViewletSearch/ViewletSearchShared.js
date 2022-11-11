// TODO duplicate code with Extensions List

export const getListHeight = (state) => {
  const { height, headerHeight } = state
  return height - headerHeight
}
