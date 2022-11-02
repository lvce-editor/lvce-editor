import * as Assert from '../Assert/Assert.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.Terminal2

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal2'
  $Viewlet.textContent = 'terminal'
  return {
    $Viewlet,
  }
}

export const focus = (state) => {
  Assert.object(state)
  const { terminal } = state
  terminal.focus()
}
