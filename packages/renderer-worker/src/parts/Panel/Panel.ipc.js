import * as Command from '../Command/Command.js'
import * as Panel from '../Viewlet/ViewletPanel.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Panel.tabsHandleClick', Viewlet.wrapViewletCommand('Panel', Panel.tabsHandleClick))
  Command.register('Panel.openViewlet', Viewlet.wrapViewletCommand('Panel', Panel.openViewlet))
  Command.register('Panel.create', Panel.create)
}
