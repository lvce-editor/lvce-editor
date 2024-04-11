export const setFocusedIndex = (state, focusedIndex) => {
  const { $Viewlet } = state
  if (focusedIndex === -1) {
    $Viewlet.classList.add('FocusOutline')
    $Viewlet.focus()
  }
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}

export * as EventMap from './ViewletProblemsEvents.ts'
export * as Events from './ViewletProblemsEvents.ts'
