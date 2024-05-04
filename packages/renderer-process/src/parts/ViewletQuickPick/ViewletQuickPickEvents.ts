/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as Event from '../Event/Event.ts'
import * as IsMobile from '../IsMobile/IsMobile.ts'

// TODO use another virtual list that just appends elements and
// is optimized for fast show/hide, scrolling performance should
// be good as well but is not as important as fast show/hide

// TODO screenreader makes pause after reading colon, maybe there is a setting for screenreaders so they speak normally

// TODO state

// TODO when quickpick is shown recalculate style and layout is really slow (>10ms every time)

// TODO accessibility issues with nvda: when pressing escape, it goes into different mode
// but should just close quick-pick like vscode does

export const handlePointerDown = (event) => {
  if (IsMobile.isMobile) {
    // workaround to disable virtual keyboard automatically opening on android
    // see https://stackoverflow.com/questions/48635501/how-to-hide-soft-keyboard-and-keep-input-on-focus#answer-53104238
    const $Input = document.querySelector('#QuickPickHeader .InputBox')
    if ($Input) {
      // @ts-expect-error
      $Input.readOnly = true
    }
  }
  Event.preventDefault(event)
  const { clientX, clientY } = event
  return ['handleClickAt', clientX, clientY]
}

export const handleInput = (event) => {
  const $Target = event.target
  const { value } = $Target
  return ['handleInput', value]
}

export const handleBlur = (event) => {
  return ['handleBlur']
}

// TODO
// - for windows narrator, ariaLabel works well
// - for nvda ariaRoleDescription works better

export const handleBeforeInput = (event) => {
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  return ['handleBeforeInput', inputType, data, selectionStart, selectionEnd]
}

// TODO use virtual list function again
export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  return ['handleWheel', deltaMode, deltaY]
}

export const returnValue = true
