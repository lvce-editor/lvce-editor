import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as VirtualDomElement from '../VirtualDomElement/VirtualDomElement.js'

export const elementsAdd = ($Root, patch) => {
  VirtualDom.renderInternal($Root, patch.newDom)
}

export const elementInsertBefore = ($Node, patch) => {
  const $Child = VirtualDomElement.render(patch.node)
  $Node.insertBefore($Child, $Node.children[patch.index])
}

export const elementInsertBeforeNthNth = ($Node, patch) => {
  const $Child = $Node.children[patch.n0].children[patch.n1]
  elementInsertBefore($Child, patch)
}

export const attributeRemove = ($Node, patch) => {
  $Node.removeAttribute(patch.key)
}

export const attributeSet = ($Node, patch) => {
  if (patch.key === 'text') {
    $Node.nodeValue = patch.value
  } else {
    $Node[patch.key] = patch.value
  }
}

export const elementsRemove = ($Node, patch) => {
  const $Parent = $Node.parentNode
  const $NewChildren = [...$Parent.children].slice(0, patch.keepCount)
  console.log({ $Node, patch })
  $Parent.replaceChildren(...$NewChildren)
}

export const elementIdSetStyle = ($Node, patch) => {
  $Node.style[patch.key] = patch.value
}

export const attributeRemoveNth = ($Node, patch) => {
  const $Child = $Node.children[patch.index]
  attributeRemove($Child, patch)
}

export const patchAttributeSetNth = ($Node, patch) => {
  const $Child = $Node.children[patch.index]
  attributeSet($Child, patch)
}

export const setElementId = ($Node, patch) => {
  $Node.id = patch.value
}

export const setElementIdNth = ($Node, patch) => {
  const $Child = $Node.children[patch.index]
  setElementId($Child, patch)
}

export const removeId = ($Node, patch) => {
  $Node.removeAttribute('id')
}

export const removeIdNth = ($Node, patch) => {
  const $Child = $Node.children[patch.index]
  removeId($Child, patch)
}

export const setHeight = ($Node, patch) => {
  $Node.style.height = `${patch.value}px`
}

export const setValue = ($Node, patch) => {
  $Node.value = patch.value
}

export const setSrc = ($Node, patch) => {
  $Node.src = patch.value
}

export const setSrcNthNth = ($Node, patch) => {
  const $Child = $Node.children[patch.n0].children[patch.n1]
  setSrc($Child, patch)
}

export const setCursorOffset = ($Node, patch) => {
  $Node.selectionStart = patch.value
  $Node.selectionEnd = patch.value
}

export const setAriaActiveDescendant = ($Node, patch) => {
  $Node.setAttribute('aria-activedescendant', patch.value)
}

export const removeAriaActiveDescendant = ($Node, patch) => {
  $Node.removeAttribute('aria-activedescendant')
}
