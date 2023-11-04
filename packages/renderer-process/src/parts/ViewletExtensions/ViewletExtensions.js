// based on https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/extensions/browser/extensionsList.ts (License MIT)

import * as FindIndex from '../../shared/findIndex.js'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaLiveType from '../AriaLiveType/AriaLiveType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as IsMobile from '../IsMobile/IsMobile.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletExtensionsEvents from './ViewletExtensionsEvents.js'
import * as FocusKey from '../FocusKey/FocusKey.js'

const activeId = 'ExtensionActive'

// TODO vscode uninstall behaviour is better -> more subtle uninstall -> no cta for uninstalling

const create$ExtensionSuggestions = () => {
  const $ExtensionSuggestions = document.createElement('div')
  $ExtensionSuggestions.className = 'ExtensionSuggestions'
  return $ExtensionSuggestions
}

const create$ExtensionSuggestion = (item) => {}

const findIndex = ($Target) => {
  if ($Target.className.includes('ExtensionListItem')) {
    return FindIndex.findIndex($Target.parentNode, $Target)
  }
  if ($Target.classList.contains('Viewlet')) {
    return -1
  }
  return findIndex($Target.parentNode)
  // return -2
}

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Extensions in Marketplace'
  $InputBox.name = 'extensions-search-value'

  const $ExtensionHeader = document.createElement('div')
  $ExtensionHeader.className = 'ExtensionHeader'
  $ExtensionHeader.append($InputBox)

  // TODO handle error
  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  $ListItems.tabIndex = 0
  $ListItems.ariaLabel = 'Extensions'
  $ListItems.role = AriaRoles.List

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)

  const $List = document.createElement('div')
  $List.className = 'Viewlet List'
  $List.append($ListItems, $ScrollBar)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Extensions'
  $Viewlet.ariaLive = AriaLiveType.Polite
  $Viewlet.ariaBusy = AriaBoolean.True
  $Viewlet.role = AriaRoles.None
  $Viewlet.append($ExtensionHeader, $List)

  return {
    $Viewlet,
    $List,
    $ListItems,
    $InputBox,
    $ExtensionSuggestions: undefined,
    $ScrollBarThumb,
    $ScrollBar,
    $Message: undefined,
  }
}

export const attachEvents = (state) => {
  const { $InputBox, $ListItems, $ScrollBar } = state
  $InputBox.oninput = ViewletExtensionsEvents.handleInput

  $ListItems.oncontextmenu = ViewletExtensionsEvents.handleContextMenu
  if (IsMobile.isMobile) {
    $ListItems.onclick = ViewletExtensionsEvents.handlePointerDown
  } else {
    $ListItems.onpointerdown = ViewletExtensionsEvents.handlePointerDown
  }
  $ListItems.onfocus = ViewletExtensionsEvents.handleFocus
  $ListItems.onscroll = ViewletExtensionsEvents.handleScroll
  $ListItems.addEventListener(DomEventType.TouchStart, ViewletExtensionsEvents.handleTouchStart, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.TouchMove, ViewletExtensionsEvents.handleTouchMove, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.TouchEnd, ViewletExtensionsEvents.handleTouchEnd, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.Wheel, ViewletExtensionsEvents.handleWheel, DomEventOptions.Passive)

  $ScrollBar.onpointerdown = ViewletExtensionsEvents.handleScrollBarPointerDown
}

// TODO possibly use aria active descendant instead
export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex, focused) => {
  Assert.object(state)
  Assert.number(oldFocusedIndex)
  Assert.number(newFocusedIndex)
  const { $ListItems } = state
  const { length } = $ListItems.children
  if (oldFocusedIndex === -1) {
    $ListItems.classList.remove('FocusOutline')
  } else if (oldFocusedIndex >= 0 && oldFocusedIndex < length) {
    $ListItems.children[oldFocusedIndex].removeAttribute('id')
  }
  if (newFocusedIndex === -1) {
    if (focused) {
      $ListItems.removeAttribute(DomAttributeType.AriaActiveDescendant)
      $ListItems.classList.add('FocusOutline')
    }
  } else if (newFocusedIndex >= 0 && newFocusedIndex < length) {
    $ListItems.children[newFocusedIndex].id = activeId
    $ListItems.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
  }
  if (focused) {
    $ListItems.focus()
    Focus.setFocus(FocusKey.Extensions)
  }
}

export const focus = (state) => {
  Assert.object(state)
  state.$InputBox.focus()
}

export const setExtensionState = (state, id, extensionState) => {
  // const index = state.extensions.findIndex((extension) => extension.id === id)
  // if (index === -1) {
  //   return
  // }
  // state.extensions[index].state = extensionState
  // render(state)
}

export const setMessage = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $List, $ListItems, $ScrollBar } = state
  if (!message) {
    $List.replaceChildren($ListItems, $ScrollBar)
    state.$Message = undefined
    return
  }
  const $Message = document.createElement('div')
  $Message.className = 'ViewletExtensionMessage'
  $Message.textContent = message
  $List.replaceChildren($Message)
  state.$Message = $Message
}

export const setExtensionsDom = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $Viewlet, $ListItems } = state
  const $Root = VirtualDom.render(dom)
  $ListItems.replaceChildren(...$Root.firstChild.childNodes)
}

export const dispose = (state) => {}

export const openSuggest = (state) => {
  // TODO maybe cache getBoundingClientRect (though it is not a bottleneck right now)
  // TODO getBoundingClientRect should not be needed, all positions should be known already in renderer worker
  const rect = state.$InputBox.getBoundingClientRect()
  const x = rect.left
  const y = rect.top
  // const x = state.$InputBox.offsetLeft
  // const y = state.$InputBox.offsetTop
  state.$ExtensionSuggestions ||= create$ExtensionSuggestions()
  SetBounds.setBounds(state.$ExtensionSuggestions, x, y, 100, 100)
  state.$ExtensionSuggestions.style.position = 'fixed'
  state.$ExtensionSuggestions.style.background = 'lime'
  // TODO check if already mounted
  // TODO don't append to body, have separate container for widgets (https://news.ycombinator.com/item?id=28230977)
  document.body.append(state.$ExtensionSuggestions)
}

export const closeSuggest = (state) => {
  state.$ExtensionSuggestions.remove()
}

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $ListItems } = state
  $ListItems.textContent = message
}

export const setSearchValue = (state, oldValue, newValue) => {
  const { $InputBox } = state
  $InputBox.value = newValue
}

export * from '../ViewletList/ViewletList.js'
