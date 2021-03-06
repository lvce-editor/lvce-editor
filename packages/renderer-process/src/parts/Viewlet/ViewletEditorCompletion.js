import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Widget from '../Widget/Widget.js'

export const name = 'EditorCompletion'

// TODO technically, editorCompletions could also be a viewlet so that
// all state is managed by viewlet and this module is completely functional

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  if ($Target.classList.contains('EditorCompletionItem')) {
    return getNodeIndex($Target)
  }
  return -1
}

const handleMousedown = (event) => {
  event.preventDefault()
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  RendererWorker.send(
    /* ViewletEditorCompletion.selectIndex */ 'EditorCompletion.selectIndex',
    /* index */ index
  )
}

const create$CompletionItem = (item, index) => {
  const $CompletionItem = document.createElement('li')
  $CompletionItem.textContent = item.label
  $CompletionItem.setAttribute('role', 'option')
  $CompletionItem.id = `CompletionItem-${index}`
  $CompletionItem.className = `EditorCompletionItem Icon${item.icon}`
  return $CompletionItem
}

export const create = () => {
  // TODO recycle nodes
  const $Viewlet = document.createElement('ul')
  $Viewlet.className = 'Viewlet Completions'
  $Viewlet.dataset.viewletId = name
  $Viewlet.id = 'Completions'
  $Viewlet.setAttribute('role', 'listbox')
  $Viewlet.ariaLabel = 'Suggest'
  $Viewlet.onmousedown = handleMousedown
  return {
    $Viewlet,
  }
}

// TODO show should be passed active cursor position
// this would make this function easier to test as it would avoid dependency on globals of other files

export const setPosition = (state, x, y) => {
  const { $Viewlet } = state
  $Viewlet.style.transform = `translate(${x}px, ${y}px)`
}

export const setItems = (state, items, reason, focusedIndex) => {
  console.log('COMPLETION SHOW', items)
  const { $Viewlet } = state
  while ($Viewlet.firstChild) {
    $Viewlet.firstChild.remove()
  }
  Focus.setAdditionalFocus('editorCompletions')
  if (items.length === 0) {
    if (reason === /* automatically */ 0) {
      return
    }
    $Viewlet.textContent = 'No Results'
    Widget.append($Viewlet)
    return
  }
  // TODO recycle nodes
  $Viewlet.append(...items.map(create$CompletionItem))
  Widget.append($Viewlet)
  focusIndex(state, 0, 0)
  // TODO set right aria attributes on $EditorInput
}

export const move = (state, x, y) => {
  const { $Viewlet } = state
  $Viewlet.style.transform = `translate(${x}px, ${y}px)`
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
  // state.$EditorInput.removeAttribute('aria-activedescendant')
  Focus.removeAdditionalFocus('editorCompletions')
}

// TODO should pass maybe oldIndex to be removed
// but keeping $ActiveItem in state also works
export const focusIndex = (state, oldIndex, newIndex) => {
  const $Viewlet = state.$Viewlet
  if (oldIndex !== -1) {
    const $OldItem = $Viewlet.children[oldIndex]
    $OldItem.classList.remove('Focused')
  }
  if (newIndex !== -1) {
    const $NewItem = $Viewlet.children[newIndex]
    $NewItem.classList.add('Focused')
  }
  Focus.setAdditionalFocus('editorCompletions')
  // state.$EditorInput.setAttribute('aria-activedescendant', $NewItem.id) // TODO use idl once supported
}

export const showLoading = (state, x, y) => {
  const { $Viewlet } = state
  $Viewlet.style.transform = `translate(${x}px, ${y}px)`
  const $Loading = document.createElement('div')
  $Loading.textContent = 'Loading'
  $Viewlet.append($Loading)
  Widget.append($Viewlet)
  Focus.setAdditionalFocus('editorCompletions')
}

export const handleError = (state, error) => {
  const { $Viewlet } = state
  $Viewlet.textContent = `${error}`
}
