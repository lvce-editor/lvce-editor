import * as WrapKeyBindingCommand from '../WrapKeyBindingCommand/WrapKeyBindingCommand.ts'
import * as ViewletKeyBindings from './ViewletKeyBindings.js'

const commands = [
  'focusFirst',
  'focusLast',
  'focusNext',
  'focusPrevious',
  'handleClick',
  'handleContextMenu',
  'handleDoubleClick',
  'handleInput',
  'handleResizerClick',
  'handleResizerMove',
  'handleSearchActionClick',
  'handleWheel',
]

export const Commands = {}

for (const command of commands) {
  Commands[command] = WrapKeyBindingCommand.wrapKeyBindingCommand(command)
}

Commands['hotReload'] = ViewletKeyBindings.hotReload
