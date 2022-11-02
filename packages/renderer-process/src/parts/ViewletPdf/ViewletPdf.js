import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletPdfEvents from './ViewletPdfEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Pdf'

  const $ButtonNextPage = document.createElement('button')
  $ButtonNextPage.textContent = 'Next'
  $ButtonNextPage.onclick = ViewletPdfEvents.handleClickNext

  const $ButtonPreviousPage = document.createElement('button')
  $ButtonPreviousPage.textContent = 'Previous'
  $ButtonPreviousPage.onclick = ViewletPdfEvents.handleClickPrevious

  const $PageNumber = InputBox.create()
  $PageNumber.type = 'number'
  $PageNumber.classList.add('PdfPageNumber')
  $PageNumber.min = '1'
  $PageNumber.autocomplete = 'off'

  const $NumberOfPages = document.createElement('div')
  $NumberOfPages.textContent = 'of 10'
  $NumberOfPages.className = 'PdfNumberOfPages'

  const $ButtonZoomIn = document.createElement('button')
  $ButtonZoomIn.textContent = 'Zoom in'
  $ButtonZoomIn.onclick = ViewletPdfEvents.handleClickZoomIn

  const $ButtonZoomOut = document.createElement('button')
  $ButtonZoomOut.textContent = 'Zoom out'
  $ButtonZoomOut.onclick = ViewletPdfEvents.handleClickZoomOut

  const $ButtonPrint = document.createElement('button')
  $ButtonPrint.textContent = 'Print'
  $ButtonPrint.onclick = ViewletPdfEvents.handleClickPrint

  const $PdfToolBar = document.createElement('div')
  $PdfToolBar.className = 'PdfToolBar'
  $PdfToolBar.append(
    $ButtonPreviousPage,
    $ButtonNextPage,
    $PageNumber,
    $NumberOfPages,
    $ButtonZoomIn,
    $ButtonZoomOut,
    $ButtonPrint
  )

  const $PdfContent = document.createElement('div')
  $PdfContent.className = 'PdfContent'

  $Viewlet.append($PdfToolBar, $PdfContent)

  return {
    $Viewlet,
    $ButtonPreviousPage,
    $ButtonNextPage,
    $ButtonZoomIn,
    $ButtonZoomOut,
    $ButtonPrint,
    $Canvas: undefined,
    $PdfContent,
    $NumberOfPages,
    $PageNumber,
  }
}

export const setCanvas = (state, id) => {
  const { $PdfContent } = state
  const $Canvas = OffscreenCanvas.get(id)
  $PdfContent.append($Canvas)
  state.$Canvas = $Canvas
}

export const setNumberOfPages = (state, numberOfPages) => {
  const { $NumberOfPages, $PageNumber } = state
  $NumberOfPages.textContent = `of ${numberOfPages}`
  $PageNumber.max = `${numberOfPages}`
}

export const setPageNumber = (state, pageNumber) => {
  const { $PageNumber } = state
  $PageNumber.value = `${pageNumber + 1}`
}
