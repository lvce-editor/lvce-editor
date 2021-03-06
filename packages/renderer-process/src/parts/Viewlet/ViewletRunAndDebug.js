import * as Highlight from '../FocusHighlight/FocusHighlight.js'
import * as Assert from '../Assert/Assert.js'
import * as ActiveViewlet from './ActiveViewlet.js'

// TODO is name export necessary? (probably not)
export const name = 'Run and Debug'

const handleMousedown = (event) => {
  const state = ActiveViewlet.getStateFromEvent(event)
  Highlight.highlightStart(state.$Viewlet)
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'RunAndDebug'
  $Viewlet.className = 'Viewlet'
  $Viewlet.textContent = 'run and debug'
  $Viewlet.tabIndex = 0
  $Viewlet.addEventListener('mousedown', handleMousedown)
  return {
    $Viewlet,
  }
}

export const refresh = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  state.$Viewlet.textContent = 'Run And Debug - Not implemented'
}

export const focus = (state) => {
  // state.$Viewlet.classList.add('Focus')
  // requestAnimationFrame(() => {
  //   state.$Viewlet.classList.add('FocusFaded')
  //   setTimeout(() => {
  //     state.$Viewlet.classList.remove('FocusFaded')
  //   }, 1000)
  // })
  state.$Viewlet.focus()
}

export const dispose = () => {}
