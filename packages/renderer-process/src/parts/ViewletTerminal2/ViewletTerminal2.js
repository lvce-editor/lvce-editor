import * as Assert from '../Assert/Assert.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'

export const name = ViewletModuleId.Terminal2

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal2'
  return {
    $Viewlet,
    $Canvas: undefined,
  }
}

export const focus = (state) => {
  Assert.object(state)
  const { terminal } = state
  terminal.focus()
}

export const setCanvas = (state, id) => {
  const { $Viewlet } = state
  const $Canvas = OffscreenCanvas.get(id)
  $Viewlet.append($Canvas)
  state.$Canvas = $Canvas
}
