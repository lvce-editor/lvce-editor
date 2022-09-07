import * as Command from '../Command/Command.js'
import * as Layout from './Layout.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.LAYOUT_UPDATE, Layout.update)
  // Command.register(1101, Layout.hideSideBar)
  // Command.register(1102, Layout.toggleSideBar)
  // Command.register(1103, Layout.showPanel)
  // Command.register(1104, Layout.hidePanel)
  // Command.register(1105, Layout.togglePanel)
  // Command.register(1106, Layout.showActivityBar)
  // Command.register(1107, Layout.hideActivityBar)
  // Command.register(1108, Layout.toggleActivityBar)
  Command.register(CommandId.LAYOUT_SHOW, Layout.show)
  Command.register(CommandId.LAYOUT_HIDE, Layout.hide)
  Command.register(CommandId.LAYOUT_GET_BOUNDS, Layout.getBounds)
}
