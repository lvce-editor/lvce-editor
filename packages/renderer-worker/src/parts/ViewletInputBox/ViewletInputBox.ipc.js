import * as ViewletInputBox from './ViewletInputBox.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'Input.cursorLeft': Viewlet.wrapViewletCommand('Input', ViewletInputBox.cursorLeft),
  'Input.cursorRight': Viewlet.wrapViewletCommand('Input', ViewletInputBox.cursorRight),
  'Input.cursorHome': Viewlet.wrapViewletCommand('Input', ViewletInputBox.cursorHome),
  'Input.cursorEnd': Viewlet.wrapViewletCommand('Input', ViewletInputBox.cursorEnd),
  'Input.handleKeyDown': Viewlet.wrapViewletCommand('Input', ViewletInputBox.handleKeyDown),
  'Input.deleteLeft': Viewlet.wrapViewletCommand('Input', ViewletInputBox.deleteLeft),
  'Input.deleteRight': Viewlet.wrapViewletCommand('Input', ViewletInputBox.deleteRight),
  'Input.handleDoubleClick': Viewlet.wrapViewletCommand('Input', ViewletInputBox.handleDoubleClick),
  'Input.handleSingleClick': Viewlet.wrapViewletCommand('Input', ViewletInputBox.handleSingleClick),
  'Input.selectCharacterRight': Viewlet.wrapViewletCommand('Input', ViewletInputBox.selectRightByCharacter),
  'Input.selectCharacterLeft': Viewlet.wrapViewletCommand('Input', ViewletInputBox.selectLeftByCharacter),
  'Input.selectAll': Viewlet.wrapViewletCommand('Input', ViewletInputBox.selectAll),
}

export * from './ViewletInputBox.js'
