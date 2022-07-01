import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('EditorCompletion.dispose', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.dispose))
  Command.register('EditorCompletion.selectIndex', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectIndex))
  Command.register('EditorCompletion.focusFirst', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusFirst))
  Command.register('EditorCompletion.focusLast', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusLast))
  Command.register('EditorCompletion.focusNext', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusNext))
  Command.register('EditorCompletion.focusPrevious', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusPrevious))
  Command.register('EditorCompletion.selectCurrent', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent))
}
