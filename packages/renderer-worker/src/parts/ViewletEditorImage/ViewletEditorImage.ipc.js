import * as Viewlet from '../Viewlet/Viewlet.js'
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
  'EditorImage.handlePointerDown': Viewlet.wrapViewletCommand(ViewletEditorImage.name, ViewletEditorImage.handlePointerDown),
  'EditorImage.handlePointerMove': Viewlet.wrapViewletCommand(ViewletEditorImage.name, ViewletEditorImage.handlePointerMove),
  'EditorImage.handlePointerUp': Viewlet.wrapViewletCommand(ViewletEditorImage.name, ViewletEditorImage.handlePointerUp),
  'EditorImage.handleWheel': Viewlet.wrapViewletCommand(ViewletEditorImage.name, ViewletEditorImage.handleWheel),
}

export * from './ViewletEditorImage.js'
