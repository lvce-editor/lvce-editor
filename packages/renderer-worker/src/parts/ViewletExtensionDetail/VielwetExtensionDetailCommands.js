import * as ViewletExtensionDetail from './ViewletExtensionDetail.js'

// prettier-ignore
export const Commands = {
  handleIconError:  ViewletExtensionDetail.handleIconError,
}

// prettier-ignore
export const LazyCommands = {
  handleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.js'),
}
