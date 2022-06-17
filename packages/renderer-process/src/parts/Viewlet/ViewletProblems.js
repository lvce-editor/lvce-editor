import * as Assert from '../Assert/Assert.js'

export const name = 'Problems'

export const create = (problemsCount) => {
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Problems'
  $Viewlet.className = 'Viewlet'
  $Viewlet.tabIndex = 0
  return {
    $Viewlet,
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
  state.$Viewlet.focus()
}
