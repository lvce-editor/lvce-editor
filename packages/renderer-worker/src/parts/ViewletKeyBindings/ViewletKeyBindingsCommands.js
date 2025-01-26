import * as WrapKeyBindingCommand from '../WrapKeyBindingCommand/WrapKeyBindingCommand.ts'

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
  'handleWheel',
]

export const Commands = {}

for (const command of commands) {
  Commands[command] = WrapKeyBindingCommand.wrapKeyBindingCommand(command)
}
