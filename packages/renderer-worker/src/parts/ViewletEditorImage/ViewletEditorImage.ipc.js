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
  'EditorImage.copyImage': LazyCommand.create(ViewletEditorImage.name, Imports.CopyImage, 'copyImage'),
  'EditorImage.copyPath': LazyCommand.create(ViewletEditorImage.name, Imports.CopyPath, 'copyPath'),
  'EditorImage.handleContextMenu': LazyCommand.create(ViewletEditorImage.name, Imports.HandleContextMenu, 'handleContextMenu'),
  'EditorImage.handlePointerDown': ViewletEditorImage.handlePointerDown,
  'EditorImage.handlePointerMove': ViewletEditorImage.handlePointerMove,
  'EditorImage.handlePointerUp': ViewletEditorImage.handlePointerUp,
  'EditorImage.handleWheel': ViewletEditorImage.handleWheel,
}

export const css = '/css/parts/ViewletEditorImage.css'

export * from './ViewletEditorImage.js'
