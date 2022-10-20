import * as InputBox from '../InputBox/InputBox.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as ViewletSimpleBrowserEvents from './ViewletSimpleBrowserEvents.js'

export const name = 'SimpleBrowser'

/**
 * @enum {string}
 */
const UiStrings = {
  Back: 'Back',
  Forward: 'Forward',
  Reload: 'Reload',
}

export const create = () => {
  const $ButtonBack = IconButton.create$Button(UiStrings.Back, Icon.ArrowLeft)
  $ButtonBack.onclick = ViewletSimpleBrowserEvents.handleClickBackward

  const $ButtonForward = IconButton.create$Button(
    UiStrings.Forward,
    Icon.ArrowRight
  )
  $ButtonForward.onclick = ViewletSimpleBrowserEvents.handleClickForward

  const $ButtonReload = IconButton.create$Button(UiStrings.Reload, Icon.Refresh)
  $ButtonReload.onclick = ViewletSimpleBrowserEvents.handleClickReload

  const $InputBox = InputBox.create()
  $InputBox.type = 'url'
  $InputBox.oninput = ViewletSimpleBrowserEvents.handleInput
  $InputBox.enterKeyHint = 'go'
  $InputBox.onfocus = ViewletSimpleBrowserEvents.handleFocus

  const $SimpleBrowserHeader = document.createElement('div')
  $SimpleBrowserHeader.className = 'SimpleBrowserHeader'
  $SimpleBrowserHeader.append(
    $ButtonBack,
    $ButtonForward,
    $ButtonReload,
    $InputBox
  )

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SimpleBrowser'
  $Viewlet.append($SimpleBrowserHeader)
  return {
    $Viewlet,
    $InputBox,
  }
}

export const setIframeSrc = (state, iframeSrc) => {
  const { $InputBox } = state
  $InputBox.value = iframeSrc
}

export const dispose = (state) => {}
