import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $Viewlet = document.createElement('iframe')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.type = 'Iframe'
  return {
    $Viewlet,
  }
}

export const setUrl = (state, src) => {
  Assert.object(state)
  Assert.string(src)
  state.$Viewlet.src = src
}

export const dispose = (state) => {}
