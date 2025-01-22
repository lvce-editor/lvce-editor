import * as ViewletExtensionDetail from './ViewletExtensionDetail.ts'
import * as WrapExtensionDetailCommand from './WrapExtensionDetailCommand.ts'

// prettier-ignore
export const Commands = {
  handleClickSize: WrapExtensionDetailCommand.wrapExtensionDetailCommand('handleClickSize'),
  handleFeaturesClick: WrapExtensionDetailCommand.wrapExtensionDetailCommand('handleFeaturesClick'),
  handleIconError: WrapExtensionDetailCommand.wrapExtensionDetailCommand('handleIconError'),
  handleReadmeContextMenu: WrapExtensionDetailCommand.wrapExtensionDetailCommand('handleReadmeContextMenu'),
  handleTabsClick: WrapExtensionDetailCommand.wrapExtensionDetailCommand('handleTabsClick'),
  hotReload: ViewletExtensionDetail.hotReload,
  selectTab:  WrapExtensionDetailCommand.wrapExtensionDetailCommand('selectTab'),
}
