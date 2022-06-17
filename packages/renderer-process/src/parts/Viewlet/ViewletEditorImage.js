import * as Assert from '../Assert/Assert.js'

export const name = 'EditorImage'

export const create = () => {
  const $Image = document.createElement('img')
  $Image.className = 'ViewletImage'
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'EditorImage'
  $Viewlet.append($Image)
  return {
    $Viewlet,
    $Image,
  }
}

export const dispose = (state) => {}

export const refresh = (state, context) => {
  Assert.object(state)
  Assert.string(context.src)
  state.$Image.src = context.src
}
