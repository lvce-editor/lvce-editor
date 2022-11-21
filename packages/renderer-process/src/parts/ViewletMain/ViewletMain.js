import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ViewletMainEvents from './ViewletMainEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Main'
  $Viewlet.className = 'Viewlet Main'
  $Viewlet.ondrop = ViewletMainEvents.handleDrop
  $Viewlet.ondragover = ViewletMainEvents.handleDragOver
  // @ts-ignore
  $Viewlet.role = AriaRoles.Main

  return {
    $Viewlet,
    $Main: $Viewlet,
  }
}
