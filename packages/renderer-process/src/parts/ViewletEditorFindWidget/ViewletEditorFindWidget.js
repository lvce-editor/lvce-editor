import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletEditorFindWidgetEvents from './ViewletEditorFindWidgetEvents.js'

export const name = 'ViewletEditorFindWidget'

export const create = () => {
  // TODO recycle nodes
  const $InputBox = InputBox.create()
  $InputBox.oninput = ViewletEditorFindWidgetEvents.handleInput

  const $Viewlet = document.createElement('ul')
  $Viewlet.className = 'Viewlet'
  $Viewlet.id = 'FindWidget'
  $Viewlet.append($InputBox)
  return {
    $Viewlet,
    $InputBox,
  }
}
