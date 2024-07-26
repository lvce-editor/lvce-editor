export const clearSearchResults = (state) => {
  return {
    ...state,
    value: '',
    items: [],
    minLineY: 0,
    maxLineY: 0,
    message: '',
  }
}
