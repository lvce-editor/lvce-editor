import * as Assert from '../Assert/Assert.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const name = 'Problems'

const handleMouseDown = (event) => {
  event.preventDefault()
  RendererWorker.send([/* ViewletProblems.focusIndex */ 7550, /* index */ -1])
}

export const create = (problemsCount) => {
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Problems'
  $Viewlet.className = 'Viewlet'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = handleMouseDown
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
  state.$Viewlet.focus()
}
