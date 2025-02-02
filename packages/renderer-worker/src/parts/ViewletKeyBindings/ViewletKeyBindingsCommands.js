import * as WrapKeyBindingCommand from '../WrapKeyBindingCommand/WrapKeyBindingCommand.ts'
import * as ViewletKeyBindings from './ViewletKeyBindings.js'

const commands = [
  'clearInput',
  'focusFirst',
  'focusLast',
  'focusNext',
  'focusPrevious',
  'handleClick',
  'handleContextMenu',
  'handleDoubleClick',
  'handleInput',
  'handleKeyDown',
  'handleResizerClick',
  'handleResizerMove',
  'handleSearchActionClick',
  'handleWheel',
  'startRecordingKeys',
  'stopRecordingKeys',
  'toggleRecordingKeys',
]

export const Commands = {}

for (const command of commands) {
  Commands[command] = WrapKeyBindingCommand.wrapKeyBindingCommand(command)
}

Commands['hotReload'] = ViewletKeyBindings.hotReload
