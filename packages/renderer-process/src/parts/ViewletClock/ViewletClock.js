import * as Assert from '../Assert/Assert.js'

export const name = 'Clock'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Clock'
  return {
    $Viewlet,
  }
}

export const dispose = (state) => {}

export const refresh = () => {}

export const setTime = (state, time) => {
  Assert.object(state)
  Assert.string(time)
  state.$Viewlet.textContent = time
}
