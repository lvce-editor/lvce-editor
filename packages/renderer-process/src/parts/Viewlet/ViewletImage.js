import * as Assert from '../Assert/Assert.js'

export const name = 'Image'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = name
  const $Image = document.createElement('img')
  return {
    $Viewlet,
    $Image,
  }
}

export const dispose = (state) => {}

export const refresh = () => {}

export const setSrc = (state, src) => {
  Assert.object(state)
  const { $Image } = state
  $Image.src = src
}
