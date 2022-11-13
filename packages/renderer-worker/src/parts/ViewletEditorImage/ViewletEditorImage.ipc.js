import * as ViewletEditorImage from './ViewletEditorImage.js'

export const name = 'EditorImage'

// prettier-ignore
export const Commands = {
  handlePointerDown: ViewletEditorImage.handlePointerDown,
  handlePointerMove: ViewletEditorImage.handlePointerMove,
  handlePointerUp: ViewletEditorImage.handlePointerUp,
  handleWheel: ViewletEditorImage.handleWheel,
}

// prettier-ignore
export const LazyCommands = {
  copyImage: () => import('./ViewletEditorImageCopyImage.js'),
  copyPath: () => import('./ViewletEditorImageCopyPath.js'),
  handleContextMenu: () => import('./ViewletEditorImageHandleContextMenu.js')
}

export const Css = '/css/parts/ViewletEditorImage.css'

export * from './ViewletEditorImage.js'
