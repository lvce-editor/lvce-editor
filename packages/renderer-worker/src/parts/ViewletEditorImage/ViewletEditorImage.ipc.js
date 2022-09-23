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
  'EditorImage.copyImage': LazyCommand.create('EditorImage', Imports.CopyImage, 'copyImage'),
  'EditorImage.handleContextMenu': LazyCommand.create('EditorImage', Imports.HandleContextMenu, 'handleContextMenu'),
  'EditorImage.handlePointerDown': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerDown),
  'EditorImage.handlePointerMove': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerMove),
  'EditorImage.handlePointerUp': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerUp),
  'EditorImage.handleWheel': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handleWheel),
  'EditorImage.copyPath': LazyCommand.create('EditorImage', Imports.CopyPath, 'copyPath'),
}

export * from './ViewletEditorImage.js'
