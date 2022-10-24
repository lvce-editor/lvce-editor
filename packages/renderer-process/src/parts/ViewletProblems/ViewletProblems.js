import * as Assert from '../Assert/Assert.js'
import * as ViewletProblemsEvents from './ViewletProblemsEvents.js'

export const name = 'Problems'

export const create = (problemsCount) => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Problems'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletProblemsEvents.handleMouseDown
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
  const { $Viewlet } = state
  if (problems.length === 0) {
    $Viewlet.ariaLabel = 'No problems have been detected in the workspace.'
    $Viewlet.textContent = 'No problems have been detected in the workspace.'
  } else {
    // TODO adjust aria-label
    $Viewlet.ariaLabel = 'No problems have been detected in the workspace.'
    $Viewlet.textContent = problems.join('\n')
  }
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}

export const css = '/css/parts/ViewletProblems.css'
