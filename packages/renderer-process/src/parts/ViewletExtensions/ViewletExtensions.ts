// based on https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/extensions/browser/extensionsList.ts (License MIT)

import * as FindIndex from '../FindIndex/FindIndex.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaLiveType from '../AriaLiveType/AriaLiveType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletExtensionsEvents from './ViewletExtensionsEvents.ts'

// TODO vscode uninstall behaviour is better -> more subtle uninstall -> no cta for uninstalling

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
  const $ExtensionHeader = document.createElement('div')
  $ExtensionHeader.className = 'ExtensionHeader'

  // TODO handle error
  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  $ListItems.tabIndex = 0
  $ListItems.ariaLabel = 'Extensions'
  $ListItems.role = AriaRoles.List

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar ScrollBarSmall'
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
    $ExtensionHeader,
    $ExtensionSuggestions: undefined,
    $ScrollBarThumb,
    $ScrollBar,
    $Message: undefined,
  }
}

export const attachEvents = (state) => {
  const { $ExtensionHeader, $ListItems, $ScrollBar } = state
  $ExtensionHeader.addEventListener(DomEventType.Input, ViewletExtensionsEvents.handleInput, DomEventOptions.Capture)
  // @ts-ignore
  $ExtensionHeader.addEventListener(DomEventType.Click, ViewletExtensionsEvents.handleHeaderClick)
  AttachEvents.attachEvents($ListItems, {
    [DomEventType.ContextMenu]: ViewletExtensionsEvents.handleContextMenu,
    [DomEventType.PointerDown]: ViewletExtensionsEvents.handlePointerDown,
    [DomEventType.Focus]: ViewletExtensionsEvents.handleFocus,
    [DomEventType.Scroll]: ViewletExtensionsEvents.handleScroll,
  })

  $ListItems.addEventListener(DomEventType.TouchStart, ViewletExtensionsEvents.handleTouchStart, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.TouchMove, ViewletExtensionsEvents.handleTouchMove, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.TouchEnd, ViewletExtensionsEvents.handleTouchEnd, DomEventOptions.Passive)
  $ListItems.addEventListener(DomEventType.Wheel, ViewletExtensionsEvents.handleWheel, DomEventOptions.Passive)

  AttachEvents.attachEvents($ScrollBar, {
    [DomEventType.PointerDown]: ViewletExtensionsEvents.handleScrollBarPointerDown,
  })
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

export const setHeaderDom = (state, dom) => {
  const { $ExtensionHeader } = state
  const $Element = VirtualDom.render(dom).firstChild.firstChild
  $ExtensionHeader.replaceChildren($Element)
}

export const setExtensionsDom = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $ListItems } = state
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
  const { $ExtensionHeader } = state
  console.log({ newValue })
  if (!$ExtensionHeader) {
    return
  }
  const $InputBox = $ExtensionHeader.querySelector('textarea')
  if (!$InputBox) {
    return
  }
  $InputBox.value = newValue
}

export * from '../ViewletList/ViewletList.ts'
