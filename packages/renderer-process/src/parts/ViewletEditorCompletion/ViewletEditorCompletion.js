import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as Label from '../Label/Label.js'
import * as MaskImage from '../MaskImage/MaskImage.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as Widget from '../Widget/Widget.js'
import * as ViewletEditorCompletionEvents from './ViewletEditorCompletionEvents.js'

const create$CompletionItem = (item) => {
  const $CompletionItemText = Label.create(item.label)

  const $Icon = document.createElement('div')
  $Icon.className = `ColoredMaskIcon ${item.symbolName}`
  MaskImage.setMaskImage($Icon, item.icon)

  const $CompletionItem = document.createElement('div')
  $CompletionItem.role = AriaRoles.Option
  $CompletionItem.className = 'EditorCompletionItem'
  $CompletionItem.append($Icon, $CompletionItemText)
  return $CompletionItem
}

export const create = () => {
  // TODO recycle nodes
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorCompletion'
  $Viewlet.id = 'Completions'
  // @ts-ignore
  $Viewlet.role = AriaRoles.ListBox
  $Viewlet.ariaLabel = 'Suggest'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.onmousedown = ViewletEditorCompletionEvents.handleMousedown
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletEditorCompletionEvents.handleWheel, DomEventOptions.Passive)
}
// TODO show should be passed active cursor position
// this would make this function easier to test as it would avoid dependency on globals of other files

export const setItems = (state, items, reason, focusedIndex) => {
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
  const { $Viewlet } = state
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
  SetBounds.setXAndYTransform($Viewlet, x, y)
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

export const setBounds = (state, x, y, width, height) => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}
