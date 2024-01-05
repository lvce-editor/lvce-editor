export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { contentPadding } = state
  const { width } = dimensions
  const contentWidth = width - contentPadding
  const columnWidth1 = contentWidth / 3
  const columnWidth2 = contentWidth / 3
  const columnWidth3 = contentWidth / 3
  return {
    ...state,
    ...dimensions,
    columnWidth1,
    columnWidth2,
    columnWidth3,
  }
}
