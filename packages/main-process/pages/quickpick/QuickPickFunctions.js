import { $QuickPickInput, $QuickPickItems } from './QuickPickElements.js'

const activeId = 'QuickPickItemActive'

const create$Item = (item) => {
  const $QuickPickItemIcon = document.createElement('div')
  $QuickPickItemIcon.className = 'QuickPickItemIcon'
  const $QuickPickItemLabel = document.createElement('div')
  $QuickPickItemLabel.className = 'Label'
  $QuickPickItemLabel.textContent = item.label

  const $QuickPickItem = document.createElement('div')
  $QuickPickItem.className = 'QuickPickItem'
  $QuickPickItem.append($QuickPickItemIcon, $QuickPickItemLabel)

  return $QuickPickItem
}
export const setVisiblePicks = (items) => {
  $QuickPickItems.replaceChildren(...items.map(create$Item))
}

export const setValue = (value) => {
  $QuickPickInput.value = value
}

export const setCursorOffset = (cursorOffset) => {
  $QuickPickInput.selectionStart = cursorOffset
  $QuickPickInput.selectionEnd = cursorOffset
}

export const setFocusedIndex = (oldFocusedIndex, newFocusedIndex) => {
  if (oldFocusedIndex >= 0) {
    const $OldItem = $QuickPickItems.children[oldFocusedIndex]
    if ($OldItem) {
      $OldItem.removeAttribute('id')
    }
  }
  if (newFocusedIndex >= 0) {
    const $NewItem = $QuickPickItems.children[newFocusedIndex]
    if ($NewItem) {
      $NewItem.id = activeId
      $QuickPickInput.setAttribute('aria-activedescendant', activeId)
    }
  }
}

export const setItemsHeight = () => {
  // not implemented
}
