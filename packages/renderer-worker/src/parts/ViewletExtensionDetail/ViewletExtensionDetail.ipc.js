import * as ViewletExtensionDetail from './ViewletExtensionDetail.js'

export const name = 'ExtensionDetail'

// prettier-ignore
export const Commands = {
  handleIconError:  ViewletExtensionDetail.handleIconError,
}

// prettier-ignore
export const LazyCommands = {
  HandleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.js'),
}

export const Css = [
  '/css/parts/ViewletExtensionDetail.css',
  '/css/parts/Markdown.css',
]

export * from './ViewletExtensionDetail.js'
