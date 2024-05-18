export const setFocused = (state, selector) => {
  if (selector === true) {
    selector = 'button'
  }
  if (!selector) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector(selector)
  console.log({ $Focusable, selector })
  $Focusable.focus()
}

export * as Events from './ViewletAboutEvents.ts'
