import * as Command from '../Command/Command.js'
import * as Layout from './Layout.js'

export const Commands = {
  'Layout.showSideBar': Layout.showSideBar,
  'Layout.hideSideBar': Layout.hideSideBar,
  'Layout.toggleSideBar': Layout.toggleSideBar,
  'Layout.showPanel': Layout.showPanel,
  'Layout.hidePanel': Layout.hidePanel,
  'Layout.togglePanel': Layout.togglePanel,
  'Layout.showActivityBar': Layout.showActivityBar,
  'Layout.hideActivityBar': Layout.hideActivityBar,
  'Layout.toggleActivityBar': Layout.toggleActivityBar,
  'Layout.hydrate': Layout.hydrate,
  'Layout.hide': Layout.hide,
  'Layout.handleResize': Layout.handleResize,
  'Layout.handleSashPointerMove': Layout.handleSashPointerMove,
  'Layout.handleSashPointerDown': Layout.handleSashPointerDown,
}
