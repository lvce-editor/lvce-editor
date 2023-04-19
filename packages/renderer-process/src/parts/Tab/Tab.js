import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Label from '../Label/Label.js'

export const create = (label, title, background) => {
  const $TabLabel = Label.create(label)

  const $TabCloseButton = document.createElement('button')
  $TabCloseButton.className = 'EditorTabCloseButton'
  $TabCloseButton.ariaLabel = 'Close'
  $TabCloseButton.title = ''

  const $Tab = document.createElement('div')
  $Tab.title = title
  $Tab.draggable = true
  $Tab.ariaSelected = background ? AriaBoolean.False : AriaBoolean.True
  $Tab.role = AriaRoles.Tab
  $Tab.className = 'MainTab'
  $Tab.append($TabLabel, $TabCloseButton)
  return $Tab
}
