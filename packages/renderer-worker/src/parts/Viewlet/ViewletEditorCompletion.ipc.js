import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletEditorCompletion.dispose', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.dispose))
  Command.register('ViewletEditorCompletion.selectIndex', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectIndex))
  Command.register('ViewletEditorCompletion.focusFirst', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusFirst))
  Command.register('ViewletEditorCompletion.focusLast', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusLast))
  Command.register('ViewletEditorCompletion.focusNext', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusNext))
  Command.register('ViewletEditorCompletion.focusPrevious', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusPrevious))
  Command.register('ViewletEditorCompletion.selectCurrent', Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent))
}
