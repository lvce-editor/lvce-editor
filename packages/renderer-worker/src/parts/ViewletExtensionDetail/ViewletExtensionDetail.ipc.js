import * as ViewletExtensionDetail from './ViewletExtensionDetail.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  HandleReadmeContextMenu: () => import('./ViewletExtensionDetailHandleReadmeContextMenu.js'),
}

// prettier-ignore
export const Commands = {
  handleIconError:  ViewletExtensionDetail.handleIconError,
  handleReadmeContextMenu: LazyCommand.create(ViewletExtensionDetail.name, Imports.HandleReadmeContextMenu, 'handleReadmeContextMenu'),
}

export const Css = [
  '/css/parts/ViewletExtensionDetail.css',
  '/css/parts/Markdown.css',
]

export * from './ViewletExtensionDetail.js'
