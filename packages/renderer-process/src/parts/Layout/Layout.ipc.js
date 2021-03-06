import * as Command from '../Command/Command.js'
import * as Layout from './Layout.js'

export const __initialize__ = () => {
  Command.register('Layout.update', Layout.update)
  // Command.register(1101, Layout.hideSideBar)
  // Command.register(1102, Layout.toggleSideBar)
  // Command.register(1103, Layout.showPanel)
  // Command.register(1104, Layout.hidePanel)
  // Command.register(1105, Layout.togglePanel)
  // Command.register(1106, Layout.showActivityBar)
  // Command.register(1107, Layout.hideActivityBar)
  // Command.register(1108, Layout.toggleActivityBar)
  Command.register('Layout.show', Layout.show)
  Command.register('Layout.hide', Layout.hide)
  Command.register('Layout.getBounds', Layout.getBounds)
}
