import { focusPage } from './ViewletPdfFocusPage.js'

export const previous = (state) => {
  const { page } = state
  if (page <= 0) {
    return state
  }
  return focusPage(state, page - 1)
}
