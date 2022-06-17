import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send([/* FindWidget.setValue  */ 4101, /* value */ value])
}

const handleClose = (event) => {
  RendererWorker.send([/* FindWidget.dispose  */ 4102])
}

const handleFocus = (event) => {
  Focus.setFocus('findWidget')
}

export const create = (id) => {
  const $FindWidgetInput = document.createElement('input')
  $FindWidgetInput.className = 'FindWidgetInput'
  $FindWidgetInput.oninput = handleInput
  $FindWidgetInput.onfocus = handleFocus
  // $FindWidgetInput.onblur = handleBlur
  const $FindWidgetButtonClose = document.createElement('button')
  $FindWidgetButtonClose.textContent = 'close'
  $FindWidgetButtonClose.onclick = handleClose
  const $FindWidget = document.createElement('div')
  $FindWidget.className = 'FindWidget'
  // $FindWidget.style.left = `${x}px`
  // $FindWidget.style.top = `${y}px`
  $FindWidget.dataset.widgetId = id
  const $FindWidgetResults = document.createElement('div')
  $FindWidgetResults.className = 'FindWidgetResults'
  $FindWidget.append(
    $FindWidgetInput,
    $FindWidgetResults,
    $FindWidgetButtonClose
  )
  const $Parent = document.querySelector('.OutputWidgets')
  $Parent.append($FindWidget)
  $FindWidgetInput.focus()
  return {
    $FindWidget,
    $FindWidgetResults,
    $FindWidgetInput,
  }
}

export const dispose = (state) => {
  state.$Viewlet.remove()
}

export const setResults = (state, results) => {
  state.$FindWidgetResults.textContent =
    results.length === 0 ? 'No Results' : `${results.length} results`
}
