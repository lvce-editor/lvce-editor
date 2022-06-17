import * as AriaAlert from '../AriaAlert/AriaAlert.js'
import * as Widget from '../Widget/Widget.js'

// TODO not sure whether created dom node
// should stay in state or be removed
// one option would result in less memory usage
// the other option would result in less garbage collection

// probably should optimize for less memory usage by default
// unless the element is very likely to be used again soon (<30s)
// but that's difficult to know

// TODO hide widget after timeout or mousemove
export const create = (message, x, y) => {
  const $EditorError = document.createElement('div')
  $EditorError.className = 'EditorWidgetError'
  $EditorError.textContent = message
  $EditorError.style.left = `${x}px`
  $EditorError.style.top = `${y}px`
  AriaAlert.alert(message)
  Widget.append($EditorError)

  return {
    $EditorError,
  }
}

export const dispose = (state) => {}
