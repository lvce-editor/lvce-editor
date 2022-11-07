import * as ViewletEditorImage from './ViewletEditorImage.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  CopyImage: () => import('./ViewletEditorImageCopyImage.js'),
  CopyPath: ()=>import('./ViewletEditorImageCopyPath.js'),
  HandleContextMenu:()=>import('./ViewletEditorImageHandleContextMenu.js')
}

// prettier-ignore
export const Commands = {
  copyImage: LazyCommand.create(ViewletEditorImage.name, Imports.CopyImage, 'copyImage'),
  copyPath: LazyCommand.create(ViewletEditorImage.name, Imports.CopyPath, 'copyPath'),
  handleContextMenu: LazyCommand.create(ViewletEditorImage.name, Imports.HandleContextMenu, 'handleContextMenu'),
  handlePointerDown: ViewletEditorImage.handlePointerDown,
  handlePointerMove: ViewletEditorImage.handlePointerMove,
  handlePointerUp: ViewletEditorImage.handlePointerUp,
  handleWheel: ViewletEditorImage.handleWheel,
}

export const Css = '/css/parts/ViewletEditorImage.css'

export * from './ViewletEditorImage.js'
