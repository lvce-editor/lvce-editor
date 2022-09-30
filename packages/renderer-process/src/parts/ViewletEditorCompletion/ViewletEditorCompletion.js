import * as Focus from '../Focus/Focus.js'
import * as Widget from '../Widget/Widget.js'
import * as ViewletEditorCompletionEvents from './ViewletEditorCompletionEvents.js'

export const name = 'EditorCompletion'

const create$CompletionItem = (item, index) => {
  const $CompletionItemText = document.createElement('div')
  $CompletionItemText.className = 'Label'
  $CompletionItemText.textContent = item.label

  const $Icon = document.createElement('div')
  $Icon.className = 'ColoredMaskIcon'
  $Icon.style.webkitMaskImage = `url('${item.icon}')`

  const $CompletionItem = document.createElement('div')
  // @ts-ignore
  $CompletionItem.role = 'option'
  $CompletionItem.id = `CompletionItem-${index}`
  $CompletionItem.className = `EditorCompletionItem`
  $CompletionItem.append($Icon, $CompletionItemText)
  return $CompletionItem
}

export const create = () => {
  // TODO recycle nodes
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = name
  $Viewlet.id = 'Completions'
  // @ts-ignore
  $Viewlet.role = 'listbox'
  $Viewlet.ariaLabel = 'Suggest'
  $Viewlet.onmousedown = ViewletEditorCompletionEvents.handleMousedown
  $Viewlet.addEventListener(
    'wheel',
    ViewletEditorCompletionEvents.handleWheel,
    {
      passive: true,
    }
  )
  return {
    $Viewlet,
  }
}

// TODO show should be passed active cursor position
// this would make this function easier to test as it would avoid dependency on globals of other files

export const setItems = (state, items, reason, focusedIndex) => {
  console.log('COMPLETION SHOW', items)
  const { $Viewlet } = state
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
  $Viewlet.replaceChildren(...items.map(create$CompletionItem))
  Widget.append($Viewlet)
  setFocusedIndex(state, 0, 0)
  // TODO set right aria attributes on $EditorInput
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
  // state.$EditorInput.removeAttribute('aria-activedescendant')
  Focus.removeAdditionalFocus('editorCompletions')
}

// TODO should pass maybe oldIndex to be removed
// but keeping $ActiveItem in state also works
export const setFocusedIndex = (state, oldIndex, newIndex) => {
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
