import * as Widget from '../Widget/Widget.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleBlur = () => {
  RendererWorker.send([/* EditorRename.abort */ 3302])
}

export const create = (x, y) => {
  const $RenameWidgetInputBox = InputBox.create()
  $RenameWidgetInputBox.className = 'RenameWidgetInputBox'
  $RenameWidgetInputBox.onblur = handleBlur
  const $RenameWidget = document.createElement('div')
  $RenameWidget.className = 'RenameWidget'
  $RenameWidget.append($RenameWidgetInputBox)
  $RenameWidget.style.left = `${x}px`
  $RenameWidget.style.top = `${y}px`
  Widget.append($RenameWidget)
  Focus.focus($RenameWidgetInputBox, 'editorRename')
  return {
    $RenameWidget,
    $RenameWidgetInputBox,
  }
}

export const dispose = (state) => {
  // TODO focus editor
  Widget.remove(state.$RenameWidget)
}

// TODO could also be event based
// finish -> finish -> finishWithValue

export const finish = (state) => {
  const value = state.$RenameWidgetInputBox.value
  // TODO don't like side effect here
  return value
}
