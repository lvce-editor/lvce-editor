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

export const patchProps = (nodeId, prop, value) => {
  const $Node = state.elements[nodeId]
  $Node.setAttribute(prop, value)
}

export const renderVirtualDom = (nodeId, virtualDom) => {}
