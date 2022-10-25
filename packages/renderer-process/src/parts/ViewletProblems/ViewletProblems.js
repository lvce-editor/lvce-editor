import * as Assert from '../Assert/Assert.js'
import * as ViewletProblemsEvents from './ViewletProblemsEvents.js'

export const name = 'Problems'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Problems'
  $Viewlet.tabIndex = 0
  $Viewlet.onpointerdown = ViewletProblemsEvents.handlePointerDown
  return {
    $Viewlet,
  }
}

export const setFocusedIndex = (state, focusedIndex) => {
  const { $Viewlet } = state
  if (focusedIndex === -1) {
    $Viewlet.classList.add('FocusOutline')
    $Viewlet.focus()
  }
}

export const setProblems = (state, problems) => {
  Assert.object(state)
  Assert.array(problems)
  // TODO
}

export const setMessage = (state, message) => {
  const { $Viewlet } = state
  $Viewlet.textContent = message
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}
