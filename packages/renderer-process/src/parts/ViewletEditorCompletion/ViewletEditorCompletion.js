import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as Label from '../Label/Label.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as Widget from '../Widget/Widget.js'
import * as ViewletEditorCompletionEvents from './ViewletEditorCompletionEvents.js'

const create$CompletionItem = () => {
  const $CompletionItemText = Label.create('')

  const $Icon = document.createElement('div')

  const $CompletionItem = document.createElement('div')
  $CompletionItem.role = AriaRoles.Option
  $CompletionItem.className = 'EditorCompletionItem'
  $CompletionItem.append($Icon, $CompletionItemText)
  return $CompletionItem
}

const render$CompletionItem = ($Item, item) => {
  SetBounds.setTop($Item, item.top)
  const $Icon = $Item.children[0]
  const $Label = $Item.children[1]
  $Icon.className = `ColoredMaskIcon ${item.symbolName}`

  if (item.highlights.length === 0) {
    $Label.textContent = item.label
    return
  }
  // TODO recycle text nodes and highlight nodes
  $Label.textContent = ''
  const highlights = item.highlights
  const label = item.label
  let position = 0
  for (let i = 0; i < highlights.length; i += 2) {
    const highlightStart = highlights[i]
    const highlightEnd = highlights[i + 1]
    if (position < highlightStart) {
      const beforeText = label.slice(position, highlightStart)
      const $BeforeText = document.createTextNode(beforeText)
      $Label.append($BeforeText)
    }
    const highlightText = label.slice(highlightStart, highlightEnd)
    const $Highlight = document.createElement('span')
    $Highlight.className = 'CompletionHighlight'
    $Highlight.textContent = highlightText
    $Label.append($Highlight)
    position = highlightEnd
  }
  // TODO support multiple highlights
  if (position < label.length) {
    const afterText = item.label.slice(position)
    const $AfterText = document.createTextNode(afterText)
    $Label.append($AfterText)
  }
}

export const create = () => {
  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  $ListItems.role = AriaRoles.ListBox
  $ListItems.ariaLabel = 'Suggest'

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)

  // TODO only create scrollbar when necessary
  // TODO recycle nodes
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorCompletion'
  $Viewlet.id = 'Completions'
  $Viewlet.append($ListItems, $ScrollBar)
  return {
    $Viewlet,
    $ListItems,
    $ScrollBar,
    $ScrollBarThumb,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet, $ListItems, $ScrollBar } = state
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletEditorCompletionEvents.handleWheel, DomEventOptions.Passive)

  $ListItems.onmousedown = ViewletEditorCompletionEvents.handleMousedown

  $ScrollBar.onpointerdown = ViewletEditorCompletionEvents.handleScrollBarPointerDown
}
// TODO show should be passed active cursor position
// this would make this function easier to test as it would avoid dependency on globals of other files

const render$ExtensionsLess = ($ListItems, items) => {
  for (let i = 0; i < $ListItems.children.length; i++) {
    render$CompletionItem($ListItems.children[i], items[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $ListItems.children.length; i < items.length; i++) {
    const $Extension = create$CompletionItem()
    render$CompletionItem($Extension, items[i])
    fragment.append($Extension)
  }
  $ListItems.append(fragment)
}

const render$ExtensionsEqual = ($ListItems, items) => {
  for (let i = 0; i < items.length; i++) {
    render$CompletionItem($ListItems.children[i], items[i])
  }
}

const render$ExtensionsMore = ($ListItems, items) => {
  for (let i = 0; i < items.length; i++) {
    render$CompletionItem($ListItems.children[i], items[i])
  }
  const diff = $ListItems.children.length - items.length
  for (let i = 0; i < diff; i++) {
    $ListItems.lastChild.remove()
  }
}

const render$Items = ($ListItems, items) => {
  if ($ListItems.children.length < items.length) {
    render$ExtensionsLess($ListItems, items)
  } else if ($ListItems.children.length === items.length) {
    render$ExtensionsEqual($ListItems, items)
  } else {
    render$ExtensionsMore($ListItems, items)
  }
}

export const setItems = (state, items, reason, focusedIndex) => {
  const { $Viewlet, $ListItems } = state
  Focus.setAdditionalFocus('editorCompletions')
  if (items.length === 0) {
    if (reason === /* automatically */ 0) {
      return
    }
    $Viewlet.textContent = 'No Results'
    Widget.append($Viewlet)
    return
  }
  render$Items($ListItems, items)
  // TODO recycle nodes
  // $ListItems.replaceChildren(...items.map(create$CompletionItem))
  // TODO
  Widget.append($Viewlet)
  // TODO set right aria attributes on $EditorInput
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
  // state.$EditorInput.removeAttribute('aria-activedescendant')
  Focus.removeAdditionalFocus('editorCompletions')
}

export const setFocusedIndex = (state, oldIndex, newIndex) => {
  if (oldIndex === newIndex) {
    debugger
  }
  const { $ListItems } = state
  if (oldIndex >= 0) {
    const $OldItem = $ListItems.children[oldIndex]
    $OldItem.classList.remove('Focused')
  }
  if (newIndex >= 0) {
    const $NewItem = $ListItems.children[newIndex]
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

export * from '../ViewletList/ViewletList.js'
