import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Pdf'

  const $ButtonNextPage = document.createElement('button')
  $ButtonNextPage.textContent = 'Next'

  const $ButtonPreviousPage = document.createElement('button')
  $ButtonPreviousPage.textContent = 'Previous'

  const $PdfToolBar = document.createElement('div')
  $PdfToolBar.className = 'PdfToolBar'
  $PdfToolBar.append($ButtonPreviousPage, $ButtonNextPage)

  $Viewlet.append($PdfToolBar)

  return {
    $Viewlet,
  }
}

export const setCanvas = (state, id) => {
  const { $Viewlet } = state
  const $Canvas = OffscreenCanvas.get(id)
  $Viewlet.append($Canvas)
}
