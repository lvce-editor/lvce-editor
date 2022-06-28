import * as Command from '../Command/Command.js'
import * as Layout from './Layout.js'

export const __initialize__ = () => {
  Command.register(1100, Layout.showSideBar)
  Command.register(1101, Layout.hideSideBar)
  Command.register(1102, Layout.toggleSideBar)
  Command.register(1103, Layout.showPanel)
  Command.register(1104, Layout.hidePanel)
  Command.register(1105, Layout.togglePanel)
  Command.register(1106, Layout.showActivityBar)
  Command.register(1107, Layout.hideActivityBar)
  Command.register(1108, Layout.toggleActivityBar)
  Command.register(1109, Layout.hydrate)
  Command.register(1110, Layout.hide)
  Command.register(1111, Layout.handleResize)
  Command.register(1112, Layout.handleSashPointerMove)
  Command.register(1113, Layout.handleSashPointerDown)
}
