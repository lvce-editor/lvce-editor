export const state = {
  elements: Object.create(null),
}

export const createElementNode = (nodeId, tagName) => {
  const $Node = document.createElement(tagName)
  state.elements[nodeId] = $Node
}

export const createTextNode = (nodeId, text) => {
  const $Node = document.createTextNode(text)
  state.elements[nodeId] = $Node
}

export const focus = (nodeId) => {
  const $Node = state.elements[nodeId]
  $Node.focus()
}

export const focusRovingTabIndexIndex = (nodeId, oldIndex, newIndex) => {
  const $Node = state.elements[nodeId]
  if (oldIndex !== -1) {
    const $OldItem = $Node.children[oldIndex]
    $OldItem.tabIndex = -1
  }
  if (newIndex !== -1) {
    $Node.tabIndex = 0
    $Node.children[newIndex].focus()
  }
}
