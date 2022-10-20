import * as Assert from '../Assert/Assert.js'

export const name = 'EditorPlainText'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorText'
  $Viewlet.textContent = 'loading...'
  return {
    $Viewlet,
  }
}

export const dispose = (state) => {}

export const refresh = (state, context) => {
  Assert.object(state)
  Assert.string(context.content)
  state.$Viewlet.textContent = context.content
}
