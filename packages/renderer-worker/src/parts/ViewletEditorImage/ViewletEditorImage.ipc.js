import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorImage from './ViewletEditorImage.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  CopyImage: () => import('./ViewletEditorImageCopyImage.js'),
}

// prettier-ignore
export const Commands = {
  'EditorImage.copyImage': LazyCommand.create('EditorImage', Imports.CopyImage, 'copyImage'),
  'EditorImage.handleContextMenu': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handleContextMenu),
  'EditorImage.handlePointerDown': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerDown),
  'EditorImage.handlePointerMove': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerMove),
  'EditorImage.handlePointerUp': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerUp),
  'EditorImage.handleWheel': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handleWheel),
}

export * from './ViewletEditorImage.js'
