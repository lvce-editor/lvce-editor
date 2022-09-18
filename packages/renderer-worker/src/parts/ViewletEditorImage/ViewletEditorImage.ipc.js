import * as ViewletEditorImage from './ViewletEditorImage.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'EditorImage.handlePointerDown': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerDown),
  'EditorImage.handlePointerMove': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerMove),
  'EditorImage.handlePointerUp': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handlePointerUp),
  'EditorImage.handleWheel': Viewlet.wrapViewletCommand('EditorImage', ViewletEditorImage.handleWheel),
}

export * from './ViewletEditorImage.js'
