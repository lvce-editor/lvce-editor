import * as Command from '../Command/Command.js'
import * as Layout from './Layout.js'

export const __initialize__ = () => {
  Command.register('Layout.showSideBar', Layout.showSideBar)
  Command.register('Layout.hideSideBar', Layout.hideSideBar)
  Command.register('Layout.toggleSideBar', Layout.toggleSideBar)
  Command.register('Layout.showPanel', Layout.showPanel)
  Command.register('Layout.hidePanel', Layout.hidePanel)
  Command.register('Layout.togglePanel', Layout.togglePanel)
  Command.register('Layout.showActivityBar', Layout.showActivityBar)
  Command.register('Layout.hideActivityBar', Layout.hideActivityBar)
  Command.register('Layout.toggleActivityBar', Layout.toggleActivityBar)
  Command.register('Layout.hydrate', Layout.hydrate)
  Command.register('Layout.hide', Layout.hide)
  Command.register('Layout.handleResize', Layout.handleResize)
  Command.register('Layout.handleSashPointerMove', Layout.handleSashPointerMove)
  Command.register('Layout.handleSashPointerDown', Layout.handleSashPointerDown)
}
