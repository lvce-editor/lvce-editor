// based on https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/extensions/browser/extensionsList.ts (License MIT)

import * as FindIndex from '../../shared/findIndex.js'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaLiveType from '../AriaLiveType/AriaLiveType.js'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Platform from '../Platform/Platform.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletExtensionsEvents from './ViewletExtensionsEvents.js'

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

  const $ExtensionHeader = document.createElement('div')
  $ExtensionHeader.className = 'ExtensionHeader'
  $ExtensionHeader.append($InputBox)

  // TODO handle error

  const $List = document.createElement('div')
  $List.className = 'Viewlet List'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Extensions'
  $Viewlet.ariaLive = AriaLiveType.Polite
  $Viewlet.ariaBusy = AriaBoolean.True
  $Viewlet.role = AriaRoles.None
  $Viewlet.append($ExtensionHeader, $List)

  return {
    $Viewlet,
    $List,
    $InputBox,
    $ExtensionSuggestions: undefined,
    $Message: undefined,
  }
}

export const attachEvents = (state) => {
  const { $InputBox } = state
  $InputBox.oninput = ViewletExtensionsEvents.handleInput
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
    Focus.setFocus('Extensions')
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

const render$Extension = ($Extension, extension) => {
  const $ExtensionDetailName = $Extension.children[1].children[0]
  const $ExtensionDetailDescription = $Extension.children[1].children[1]
  const $ExtensionAuthorName = $Extension.children[1].children[2].children[0]
  const $ExtensionIcon = $Extension.children[0]

  $Extension.ariaPosInSet = extension.posInSet
  $Extension.ariaSetSize = extension.setSize
  $Extension.dataset.state = extension.state
  $Extension.dataset.id = extension.id
  SetBounds.setTop($Extension, extension.top)

  $ExtensionDetailName.firstChild.nodeValue = extension.name
  $ExtensionDetailDescription.firstChild.nodeValue = extension.description
  $ExtensionAuthorName.firstChild.nodeValue = extension.publisher
  $ExtensionIcon.src = extension.icon
}

// TODO test that rendering and recycling text nodes works
const create$Extension = () => {
  const $ExtensionDetailName = document.createElement('div')
  $ExtensionDetailName.className = 'ExtensionListItemName'
  $ExtensionDetailName.append(document.createTextNode(''))
  const $ExtensionDetailDescription = document.createElement('div')
  $ExtensionDetailDescription.className = 'ExtensionListItemDescription'
  $ExtensionDetailDescription.append(document.createTextNode(''))
  const $ExtensionActions = document.createElement('div')
  $ExtensionActions.className = 'ExtensionActions'
  const $ExtensionActionInstall = document.createElement('div')
  $ExtensionActionInstall.className = 'ExtensionActionInstall'
  $ExtensionActionInstall.textContent = 'Install'
  const $ExtensionActionManage = document.createElement('button')
  $ExtensionActionManage.className = 'ExtensionListItemActionManage'
  $ExtensionActionManage.title = 'Manage'
  $ExtensionActionManage.ariaHasPopup = 'menu' // TODO also set this for global settings icon in activity bar
  const $ExtensionAuthorName = document.createElement('div')
  $ExtensionAuthorName.className = 'ExtensionListItemAuthorName'
  $ExtensionAuthorName.append(document.createTextNode(''))

  const icon = document.createElement('img')
  icon.width = 42
  icon.height = 42
  icon.className = 'ExtensionListItemIcon'
  icon.onerror = ViewletExtensionsEvents.handleIconError
  const buttonManage = document.createElement('button')
  buttonManage.className = 'ExtensionManage'
  // switch (extension.state) {
  //   case 'uninstalled':
  //     $ExtensionActionManage.remove()
  //     $ExtensionActions.append($ExtensionActionInstall)
  //     break
  //   case 'uninstalling':
  //     buttonManage.textContent = 'uninstalling'
  //     break
  //   case 'installing':
  //     buttonManage.textContent = 'installing'
  //     break
  //   case 'installed':
  //     $ExtensionActions.append($ExtensionActionManage)
  //     break
  //   case 'disabled':
  //     $ExtensionActions.append($ExtensionActionManage)
  //     break
  //   default:
  //     break
  // }
  const $ExtensionFooter = document.createElement('div')
  $ExtensionFooter.className = 'ExtensionListItemFooter'
  $ExtensionFooter.append($ExtensionAuthorName, $ExtensionActions)
  const $ExtensionDetail = document.createElement('div')
  $ExtensionDetail.className = 'ExtensionListItemDetail'
  $ExtensionDetail.append($ExtensionDetailName, $ExtensionDetailDescription, $ExtensionFooter)
  const $ExtensionListItem = document.createElement('div')
  $ExtensionListItem.role = AriaRoles.Article
  $ExtensionListItem.ariaRoleDescription = AriaRoleDescriptionType.Extension
  $ExtensionListItem.className = 'ExtensionListItem'
  $ExtensionListItem.role = AriaRoles.ListItem
  $ExtensionListItem.append(icon, $ExtensionDetail)
  return $ExtensionListItem
}

const render$ExtensionsLess = ($ExtensionList, extensions) => {
  for (let i = 0; i < $ExtensionList.children.length; i++) {
    render$Extension($ExtensionList.children[i], extensions[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $ExtensionList.children.length; i < extensions.length; i++) {
    const $Extension = create$Extension()
    render$Extension($Extension, extensions[i])
    fragment.append($Extension)
  }
  $ExtensionList.append(fragment)
}

const render$ExtensionsEqual = ($ExtensionList, extensions) => {
  for (let i = 0; i < extensions.length; i++) {
    render$Extension($ExtensionList.children[i], extensions[i])
  }
}

const render$ExtensionsMore = ($ExtensionList, extensions) => {
  for (let i = 0; i < extensions.length; i++) {
    render$Extension($ExtensionList.children[i], extensions[i])
  }
  const diff = $ExtensionList.children.length - extensions.length
  for (let i = 0; i < diff; i++) {
    $ExtensionList.lastChild.remove()
  }
}

const render$Extensions = ($ExtensionList, extensions) => {
  if ($ExtensionList.children.length < extensions.length) {
    render$ExtensionsLess($ExtensionList, extensions)
  } else if ($ExtensionList.children.length === extensions.length) {
    render$ExtensionsEqual($ExtensionList, extensions)
  } else {
    render$ExtensionsMore($ExtensionList, extensions)
  }
}

// TODO a more efficient approach would be
export const setExtensions = (state, extensions) => {
  Assert.object(state)
  Assert.array(extensions)
  const { $Viewlet, $ListItems } = state
  $Viewlet.removeAttribute(DomAttributeType.AriaBusy)
  render$Extensions($ListItems, extensions)
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

export const setDom = (state, dom) => {
  const { $List } = state
  VirtualDom.renderInto($List, dom, ViewletExtensionsEvents)
}

export * from '../ViewletList/ViewletList.js'
