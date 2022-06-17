import * as Command from '../Command/Command.js'
import * as Panel from '../Viewlet/ViewletPanel.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const __initialize__ = () => {
  Command.register(711, Viewlet.wrapViewletCommand('Panel', Panel.tabsHandleClick))
  Command.register(712, Viewlet.wrapViewletCommand('Panel', Panel.openViewlet))
  Command.register(713, Panel.create)
}
