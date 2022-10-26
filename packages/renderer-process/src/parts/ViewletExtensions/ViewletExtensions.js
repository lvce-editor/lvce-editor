import * as FindIndex from '../../shared/findIndex.js'
import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Platform from '../Platform/Platform.js'
import * as ViewletExtensionsEvents from './ViewletExtensionsEvents.js'

export const name = 'Extensions'

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
  $InputBox.oninput = ViewletExtensionsEvents.handleInput

  const $ExtensionHeader = document.createElement('div')
  $ExtensionHeader.className = 'ExtensionHeader'
  $ExtensionHeader.append($InputBox)

  // TODO handle error
  const $ExtensionList = document.createElement('div')
  $ExtensionList.className = 'ExtensionList'
  $ExtensionList.tabIndex = 0
  $ExtensionList.ariaLabel = 'Extensions'
  // @ts-ignore
  $ExtensionList.role = 'list'
  $ExtensionList.oncontextmenu = ViewletExtensionsEvents.handleContextMenu
  if (Platform.isMobile) {
    $ExtensionList.onclick = ViewletExtensionsEvents.handlePointerDown
  } else {
    $ExtensionList.onpointerdown = ViewletExtensionsEvents.handlePointerDown
  }
  $ExtensionList.onfocus = ViewletExtensionsEvents.handleFocus
  $ExtensionList.onscroll = ViewletExtensionsEvents.handleScroll
  $ExtensionList.addEventListener(
    'touchstart',
    ViewletExtensionsEvents.handleTouchStart,
    {
      passive: true,
    }
  )
  $ExtensionList.addEventListener(
    'touchmove',
    ViewletExtensionsEvents.handleTouchMove,
    {
      passive: true,
    }
  )
  $ExtensionList.addEventListener(
    'touchend',
    ViewletExtensionsEvents.handleTouchEnd,
    {
      passive: true,
    }
  )
  $ExtensionList.addEventListener(
    'wheel',
    ViewletExtensionsEvents.handleWheel,
    {
      passive: true,
    }
  )

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.onpointerdown = ViewletExtensionsEvents.handleScrollBarPointerDown
  $ScrollBar.append($ScrollBarThumb)

  const $ExtensionListWrapper = document.createElement('div')
  $ExtensionListWrapper.className = 'ExtensionListWrapper'
  $ExtensionListWrapper.append($ExtensionList, $ScrollBar)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Extensions'
  $Viewlet.ariaBusy = 'true'
  $Viewlet.ariaLive = 'polite'
  // @ts-ignore
  $Viewlet.role = 'none'
  $Viewlet.append($ExtensionHeader, $ExtensionListWrapper)

  return {
    $Viewlet,
    $ExtensionListWrapper,
    $ExtensionList,
    $InputBox,
    $ExtensionSuggestions: undefined,
    $ScrollBarThumb,
  }
}

// TODO possibly use aria active descendant instead
export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  Assert.object(state)
  Assert.number(oldFocusedIndex)
  Assert.number(newFocusedIndex)
  const { $ExtensionList } = state
  const { length } = $ExtensionList.children
  if (oldFocusedIndex === -1) {
    $ExtensionList.classList.remove('FocusOutline')
  } else if (oldFocusedIndex >= 0 && oldFocusedIndex < length) {
    $ExtensionList.children[oldFocusedIndex].removeAttribute('id')
  }
  if (newFocusedIndex === -1) {
    $ExtensionList.removeAttribute('aria-activedescendant')
    $ExtensionList.classList.add('FocusOutline')
  } else if (newFocusedIndex >= 0 && newFocusedIndex < length) {
    $ExtensionList.children[newFocusedIndex].id = activeId
    $ExtensionList.setAttribute('aria-activedescendant', activeId)
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

export const setError = (state, error) => {
  Assert.object(state)
  Assert.string(error)
  const $Message = document.createElement('div')
  $Message.className = 'ViewletExtensionMessage'
  $Message.textContent = error
  while (state.$ExtensionList.firstChild) {
    state.$ExtensionList.firstChild.remove()
  }
  state.$ExtensionList.append($Message)
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
  $Extension.style.top = `${extension.top}px`

  $ExtensionDetailName.firstChild.nodeValue = extension.name
  $ExtensionDetailDescription.firstChild.nodeValue = extension.description
  $ExtensionAuthorName.firstChild.nodeValue = extension.publisher
  $ExtensionIcon.src = extension.icon
}

// TODO test that rendering and recycling text nodes works
const create$Extension = () => {
  const $ExtensionDetailName = document.createElement('div')
  $ExtensionDetailName.className = 'ExtensionName'
  $ExtensionDetailName.append(document.createTextNode(''))
  const $ExtensionDetailDescription = document.createElement('div')
  $ExtensionDetailDescription.className = 'ExtensionDescription'
  $ExtensionDetailDescription.append(document.createTextNode(''))
  const $ExtensionActions = document.createElement('div')
  $ExtensionActions.className = 'ExtensionActions'
  const $ExtensionActionInstall = document.createElement('div')
  $ExtensionActionInstall.className = 'ExtensionActionInstall'
  $ExtensionActionInstall.textContent = 'Install'
  const $ExtensionActionManage = document.createElement('button')
  $ExtensionActionManage.className = 'ExtensionActionManage'
  $ExtensionActionManage.title = 'Manage'
  $ExtensionActionManage.ariaHasPopup = 'menu' // TODO also set this for global settings icon in activity bar
  const $ExtensionAuthorName = document.createElement('div')
  $ExtensionAuthorName.className = 'ExtensionAuthorName'
  $ExtensionAuthorName.append(document.createTextNode(''))

  const icon = document.createElement('img')
  icon.width = 42
  icon.height = 42
  icon.className = 'ExtensionIcon'
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
  $ExtensionFooter.className = 'ExtensionFooter'
  $ExtensionFooter.append($ExtensionAuthorName, $ExtensionActions)
  const $ExtensionDetail = document.createElement('div')
  $ExtensionDetail.className = 'ExtensionDetail'
  $ExtensionDetail.append(
    $ExtensionDetailName,
    $ExtensionDetailDescription,
    $ExtensionFooter
  )
  const $ExtensionListItem = document.createElement('div')
  // @ts-ignore
  $ExtensionListItem.role = 'article'
  $ExtensionListItem.ariaRoleDescription = 'Extension'
  $ExtensionListItem.className = 'ExtensionListItem'
  // @ts-ignore
  $ExtensionListItem.role = 'listitem'
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
    // console.log('RENDER LESS')
    render$ExtensionsLess($ExtensionList, extensions)
  } else if ($ExtensionList.children.length === extensions.length) {
    // console.log('RENDER EQUAL')
    render$ExtensionsEqual($ExtensionList, extensions)
  } else {
    // console.log('RENDER MORE')
    render$ExtensionsMore($ExtensionList, extensions)
  }
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $ExtensionList } = state
  $ExtensionList.style.top = `${negativeMargin}px`
  // Assert.number(negativeMargin)
  // const { $NegativeMargin } = state
  // $NegativeMargin.style.marginTop = `${negativeMargin}px`
}

// TODO a more efficient approach would be
export const setExtensions = (state, extensions) => {
  Assert.object(state)
  Assert.array(extensions)
  const { $Viewlet, $ExtensionList } = state
  $Viewlet.removeAttribute('aria-busy')
  if (extensions.length === 0) {
    const $Message = document.createElement('div')
    $Message.className = 'ViewletExtensionMessage'
    $Message.textContent = 'No extensions found.'
    while ($ExtensionList.firstChild) {
      $ExtensionList.firstChild.remove()
    }
    $ExtensionList.append($Message)
  } else {
    render$Extensions($ExtensionList, extensions)
  }
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
  state.$ExtensionSuggestions.style.left = `${x}px`
  state.$ExtensionSuggestions.style.top = `${y}px`
  state.$ExtensionSuggestions.style.position = 'fixed'
  state.$ExtensionSuggestions.style.width = '100px'
  state.$ExtensionSuggestions.style.height = '100px'
  state.$ExtensionSuggestions.style.background = 'lime'
  // TODO check if already mounted
  // TODO don't append to body, have separate container for widgets (https://news.ycombinator.com/item?id=28230977)
  document.body.append(state.$ExtensionSuggestions)
  // console.log(state.$InputBox)
  // console.log({ x, y })
  // console.log(state)
  // console.log('open suggest in renderer')
}

export const closeSuggest = (state) => {
  state.$ExtensionSuggestions.remove()
}

export const setContentHeight = (state, height) => {
  const { $ExtensionList } = state
  $ExtensionList.style.height = `${height}px`
}

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  state.$ExtensionList.textContent = message
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  $ScrollBarThumb.style.top = `${scrollBarY}px`
  $ScrollBarThumb.style.height = `${scrollBarHeight}px`
}

export const setSize = (state, size) => {
  const { $Viewlet } = state
  if (size === 'Small') {
    $Viewlet.classList.remove('Normal')
    $Viewlet.classList.add('Small')
  } else {
    $Viewlet.classList.remove('Small')
    $Viewlet.classList.add('Normal')
  }
}
