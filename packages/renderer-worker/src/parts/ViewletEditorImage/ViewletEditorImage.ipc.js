import * as ViewletEditorImage from './ViewletEditorImage.js'

export const name = 'EditorImage'

// prettier-ignore
export const Commands = {
  handleImageError: ViewletEditorImage.handleImageError,
  handlePointerDown: ViewletEditorImage.handlePointerDown,
  handlePointerMove: ViewletEditorImage.handlePointerMove,
  handlePointerUp: ViewletEditorImage.handlePointerUp,
  handleWheel: ViewletEditorImage.handleWheel,
  moveUp: ViewletEditorImage.moveUp,
  moveDown: ViewletEditorImage.moveDown,
  moveLeft: ViewletEditorImage.moveLeft,
  moveRight: ViewletEditorImage.moveRight,
}

// prettier-ignore
export const LazyCommands = {
  copyImage: () => import('./ViewletEditorImageCopyImage.js'),
  copyPath: () => import('./ViewletEditorImageCopyPath.js'),
  handleContextMenu: () => import('./ViewletEditorImageHandleContextMenu.js')
}

export const Css = '/css/parts/ViewletEditorImage.css'

export * from './ViewletEditorImage.js'
