import { focusPage } from './ViewletPdfFocusPage.js'

export const next = async (state) => {
  const { page } = state
  return focusPage(state, page + 1)
}
