import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as FileIcon from '../FileIcon/FileIcon.js'

export const create = (label, title, icon, tabWidth, preview, background) => {
  const $TabIcon = FileIcon.create(icon)

  const $TabLabel = document.createElement('div')
  $TabLabel.className = 'TabLabel'
  $TabLabel.textContent = label

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
  if (preview) {
    $Tab.classList.add('MainTabPreview')
  }
  $Tab.style.width = `${tabWidth}px`
  $Tab.append($TabIcon, $TabLabel, $TabCloseButton)
  return $Tab
}
