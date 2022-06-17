import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

export const __initialize__ = () => {
  Command.register(981, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.dispose))
  Command.register(982, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectIndex))
  Command.register(983, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusFirst))
  Command.register(984, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusLast))
  Command.register(985, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusNext))
  Command.register(986, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusPrevious))
  Command.register(987, Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent))
}
