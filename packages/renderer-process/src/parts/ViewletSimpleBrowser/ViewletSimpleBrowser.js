import * as EnterKeyHintType from '../EnterKeyHintType/EnterKeyHintType.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as InputType from '../InputType/InputType.js'
import * as MaskImage from '../MaskImage/MaskImage.js'
import * as ViewletSimpleBrowserEvents from './ViewletSimpleBrowserEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Back: 'Back',
  Forward: 'Forward',
  Reload: 'Reload',
  OpenExternal: 'Open External',
  Cancel: 'Cancel',
}

export const create = () => {
  const $ButtonBack = IconButton.create$Button(UiStrings.Back, 'ArrowLeft')
  $ButtonBack.onclick = ViewletSimpleBrowserEvents.handleClickBackward

  const $ButtonForward = IconButton.create$Button(UiStrings.Forward, 'ArrowRight')
  $ButtonForward.onclick = ViewletSimpleBrowserEvents.handleClickForward

  const $ButtonReload = IconButton.create$Button(UiStrings.Reload, 'Refresh')
  $ButtonReload.onclick = ViewletSimpleBrowserEvents.handleClickReload

  const $InputBox = InputBox.create()
  $InputBox.type = InputType.Url
  $InputBox.enterKeyHint = EnterKeyHintType.Go
  $InputBox.oninput = ViewletSimpleBrowserEvents.handleInput
  $InputBox.onfocus = ViewletSimpleBrowserEvents.handleFocus
  $InputBox.onblur = ViewletSimpleBrowserEvents.handleBlur

  const $ButtonOpenExternal = IconButton.create$Button(UiStrings.OpenExternal, 'LinkExternal')
  $ButtonOpenExternal.onclick = ViewletSimpleBrowserEvents.handleClickOpenExternal

  const $SimpleBrowserHeader = document.createElement('div')
  $SimpleBrowserHeader.className = 'SimpleBrowserHeader'
  $SimpleBrowserHeader.append($ButtonBack, $ButtonForward, $ButtonReload, $InputBox, $ButtonOpenExternal)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SimpleBrowser'
  $Viewlet.append($SimpleBrowserHeader)
  return {
    $Viewlet,
    $InputBox,
    $ButtonBack,
    $ButtonForward,
    $ButtonReload,
  }
}

export const setIframeSrc = (state, iframeSrc) => {
  const { $InputBox } = state
  if ($InputBox.value === iframeSrc) {
    return
  }
  $InputBox.value = iframeSrc
}

export const setButtonsEnabled = (state, canGoBack, canGoForward) => {
  const { $ButtonForward, $ButtonBack } = state
  $ButtonBack.disabled = !canGoBack
  $ButtonForward.disabled = !canGoForward
}

export const setLoading = (state, loading) => {
  const { $ButtonReload } = state
  const $Icon = $ButtonReload.firstChild
  if (loading) {
    $ButtonReload.title = UiStrings.Cancel
    MaskImage.setMaskImage($Icon, 'Close')
  } else {
    $ButtonReload.title = UiStrings.Reload
    MaskImage.setMaskImage($Icon, 'Refresh')
  }
}

export const dispose = (state) => {}
