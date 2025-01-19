import * as ViewletExtensionDetail from './ViewletExtensionDetail.ts'

// prettier-ignore
export const Commands = {
  handleIconError: ViewletExtensionDetail.handleIconError,
  hotReload: ViewletExtensionDetail.hotReload,
  handleTabsClick: ViewletExtensionDetail.handleTabsClick,
  selectTab: ViewletExtensionDetail.selectTab,
  handleFeaturesClick: ViewletExtensionDetail.handleFeaturesClick,
}

// prettier-ignore
export const LazyCommands = {
  handleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.ts'),
}
