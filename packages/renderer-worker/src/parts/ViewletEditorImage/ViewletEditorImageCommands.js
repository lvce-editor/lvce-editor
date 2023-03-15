import * as ViewletEditorImage from './ViewletEditorImage.js'

// prettier-ignore
export const Commands = {
  handleImageError: ViewletEditorImage.handleImageError,
  handlePointerDown: ViewletEditorImage.handlePointerDown,
  handlePointerMove: ViewletEditorImage.handlePointerMove,
  handlePointerUp: ViewletEditorImage.handlePointerUp,
  handleWheel: ViewletEditorImage.handleWheel,
  moveDown: ViewletEditorImage.moveDown,
  moveLeft: ViewletEditorImage.moveLeft,
  moveRight: ViewletEditorImage.moveRight,
  moveUp: ViewletEditorImage.moveUp,
}

// prettier-ignore
export const LazyCommands = {
  copyImage: () => import('./ViewletEditorImageCopyImage.js'),
  copyPath: () => import('./ViewletEditorImageCopyPath.js'),
  handleContextMenu: () => import('./ViewletEditorImageHandleContextMenu.js')
}
