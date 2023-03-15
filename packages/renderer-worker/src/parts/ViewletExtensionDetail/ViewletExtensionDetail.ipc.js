import * as ViewletExtensionDetail from './ViewletExtensionDetail.js'

export const name = 'ExtensionDetail'

// prettier-ignore
export const Commands = {
  handleIconError:  ViewletExtensionDetail.handleIconError,
}

// prettier-ignore
export const LazyCommands = {
  handleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.js'),
}

export * from './ViewletExtensionDetailCss.js'
export * from './ViewletExtensionDetail.js'
