import * as ViewletExtensionDetail from './ViewletExtensionDetail.ts'

// prettier-ignore
export const Commands = {
  handleIconError: ViewletExtensionDetail.handleIconError,
  hotReload: ViewletExtensionDetail.hotReload,
}

// prettier-ignore
export const LazyCommands = {
  handleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.ts'),
}
