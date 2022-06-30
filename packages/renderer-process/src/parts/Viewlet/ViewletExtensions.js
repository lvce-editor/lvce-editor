import * as FindIndex from '../../shared/findIndex.js'
import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ActiveViewlet from './ActiveViewlet.js'

export const name = 'Extensions'

// TODO vscode uninstall behaviour is better -> more subtle uninstall -> no cta for uninstalling

const DEFAULT_ICON_SRC = '/icons/extensionDefaultIcon.png'
const DEFAULT_ICON_LANGUAGE_BASICS = '/icons/language-icon.svg'
const DEFAULT_ICON_THEME = '/icons/theme-icon.png'

const create$ExtensionSuggestions = () => {
  const $ExtensionSuggestions = document.createElement('div')
  $ExtensionSuggestions.className = 'ExtensionSuggestions'
  return $ExtensionSuggestions
}

const create$ExtensionSuggestion = (item) => {}

const getIconSrc = (extension) => {
  if (extension.icon) {
    return extension.icon
  }
  if (extension.name && extension.name.startsWith('Language Basics')) {
    return DEFAULT_ICON_LANGUAGE_BASICS
  }
  if (extension.name && extension.name.endsWith(' Theme')) {
    return DEFAULT_ICON_THEME
  }
  return DEFAULT_ICON_SRC
}

const handleIconError = (event) => {
  const $Target = event.target
  if ($Target.src.endsWith(DEFAULT_ICON_SRC)) {
    return
  }
  $Target.src = DEFAULT_ICON_SRC
}

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case event.DOM_DELTA_LINE:
      RendererWorker.send([
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY,
      ])
      break
    case event.DOM_DELTA_PIXEL:
      RendererWorker.send([
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY,
      ])
      break
    default:
      break
  }
}

const handleInput = (event) => {
  // const state = ActiveViewlet.getStateFromEvent(event)
  const $Target = event.target
  RendererWorker.send([
    /* ViewletExtensions.handleInput */ 863,
    /* value */ $Target.value,
  ])
  // TODO
  // state.$Viewlet.ariaBusy = 'true'
}

const handleContextMenu = (event) => {
  event.preventDefault()
  const state = ActiveViewlet.getStateFromEvent(event)
  const $Target = event.target
  const index = FindIndex.findIndex(state.$Extensions, $Target)
  if (index === -1) {
    return
  }
  const extension = state.extensions[index]
  RendererWorker.send([
    /* ViewletExplorer.handleContextMenu */ 'Extensions.handleContextMenu',
    /* x */ event.clientX,
    /* y */ event.clientY,
    /* extensionId */ extension.id,
  ])
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleClick = (event) => {
  const $Target = event.target
  console.log($Target)
  switch ($Target.className) {
    case 'Extension': {
      const index = getNodeIndex($Target)
      RendererWorker.send([
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index,
      ])
      break
    }
    case 'ExtensionName':
    case 'ExtensionDescription':
    case 'ExtensionFooter': {
      const index = getNodeIndex($Target.parentNode.parentNode)
      RendererWorker.send([
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index,
      ])
      break
    }
    case 'ExtensionAuthorName': {
      const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
      RendererWorker.send([
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index,
      ])
      break
    }
    default:
      break
  }
}

const handleFocus = (event) => {
  const $Target = event.target
  $Target.classList.add('FocusOutline')
  // TODO maybe have one focus listener inside Viewlet.js instead of each viewlet
  Focus.setFocus('viewletExtensions')

  // RendererWorker.send([/* ViewletExtensions.focusIndex */ 868, /* index */ -1])
}

const handleScrollBarMouseDown = (event) => {
  const $Target = event.target
  if ($Target.className === 'ScrollBarThumb') {
    window.addEventListener('mousemove', handleScrollBarThumbMouseMove)
    window.addEventListener('mouseup', handleScrollBarThumbMouseUp)
  } else {
    const y = event.clientY
    console.log({ y })
    RendererWorker.send([
      /* ViewletExtensions.handleScrollBarClick */ 'Extensions.handleScrollBarClick',
      /* y */ y,
    ])
  }
}

const handleScrollBarThumbMouseMove = (event) => {
  const y = event.clientY
  RendererWorker.send([
    /* ViewletExtensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove',
    /* y */ y,
  ])
}

const handleScrollBarThumbMouseUp = () => {
  window.removeEventListener('mousemove', handleScrollBarThumbMouseMove)
  window.removeEventListener('mouseup', handleScrollBarThumbMouseUp)
}

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Extensions in Marketplace'
  $InputBox.oninput = handleInput
  const $ExtensionHeader = document.createElement('div')
  $ExtensionHeader.className = 'ExtensionHeader'
  $ExtensionHeader.append($InputBox)
  // TODO handle error
  const $ExtensionList = document.createElement('div')
  $ExtensionList.className = 'ExtensionList'
  $ExtensionList.tabIndex = 0
  $ExtensionList.ariaLabel = 'Extensions'
  $ExtensionList.setAttribute('role', 'list')
  $ExtensionList.oncontextmenu = handleContextMenu
  $ExtensionList.onclick = handleClick
  $ExtensionList.onfocus = handleFocus

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.onmousedown = handleScrollBarMouseDown
  $ScrollBar.append($ScrollBarThumb)

  const $ExtensionListWrapper = document.createElement('div')
  $ExtensionListWrapper.className = 'ExtensionListWrapper'
  $ExtensionListWrapper.append($ExtensionList, $ScrollBar)

  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Extensions'
  $Viewlet.className = 'Viewlet'
  $Viewlet.ariaBusy = 'true'
  $Viewlet.ariaLive = 'polite'
  $Viewlet.append($ExtensionHeader, $ExtensionListWrapper)
  $Viewlet.addEventListener('wheel', handleWheel, { passive: true })

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
  if (oldFocusedIndex !== -1) {
    console.log($ExtensionList)
    $ExtensionList.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex === -1) {
    $ExtensionList.removeAttribute('aria-activedescendant')
    $ExtensionList.classList.add('FocusOutline')
  } else {
    $ExtensionList.setAttribute(
      'aria-activedescendant',
      $ExtensionList.children[newFocusedIndex].id
    )
    $ExtensionList.classList.remove('FocusOutline')
    $ExtensionList.children[newFocusedIndex].classList.add('Focused')
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
  const $EXtensionIcon = $Extension.children[0]

  $Extension.ariaPosInSet = extension.posInSet
  $Extension.ariaSetSize = extension.setSize
  $Extension.id = `Extension-${extension.posInSet}`
  $Extension.dataset.state = extension.state
  $Extension.dataset.id = extension.id
  $Extension.style.top = `${extension.top}px`

  $ExtensionDetailName.firstChild.nodeValue =
    extension.name || extension.id || 'n/a'

  $ExtensionDetailDescription.firstChild.nodeValue =
    extension.description || 'n/a'

  $ExtensionAuthorName.firstChild.nodeValue =
    extension.type === 'builtin' ? 'builtin' : extension.publisher || 'n/a'

  $EXtensionIcon.src = getIconSrc(extension)
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
  icon.className = 'ExtensionIcon'
  icon.onerror = handleIconError
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
  const $ExtensionListItem = document.createElement('article')
  $ExtensionListItem.ariaRoleDescription = 'Extension' // TODO use idl once supported and add test for this
  $ExtensionListItem.className = 'ExtensionListItem'
  $ExtensionListItem.setAttribute('role', 'listitem')

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
