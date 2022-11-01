import { focusPage } from './ViewletPdfFocusPage.js'

export const previous = (state) => {
  const { page } = state
  return focusPage(state, page - 1)
}
