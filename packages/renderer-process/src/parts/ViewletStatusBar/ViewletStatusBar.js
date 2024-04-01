import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'StatusBar'
  $Viewlet.className = 'Viewlet StatusBar'
  $Viewlet.tabIndex = 0
  $Viewlet.role = AriaRoles.Status
  $Viewlet.ariaRoleDescription = AriaRoleDescriptionType.StatusBar
  $Viewlet.ariaLive = 'off' // see https://github.com/microsoft/vscode/issues/94677

  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const focus = (state) => {
  Assert.object(state)
  const { $Viewlet } = state
  $Viewlet.focus()
}
