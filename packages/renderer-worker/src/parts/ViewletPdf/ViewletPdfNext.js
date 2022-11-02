import { focusPage } from './ViewletPdfFocusPage.js'

export const next = (state) => {
  const { page, numberOfPages } = state
  if (page >= numberOfPages - 1) {
    return state
  }
  return focusPage(state, page + 1)
}
