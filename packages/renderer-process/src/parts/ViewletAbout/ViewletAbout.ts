export const setFocused = (state, value) => {
  if (!value) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector('button')
  $Focusable.focus()
}

export * as Events from './ViewletAboutEvents.ts'
