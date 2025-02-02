import * as WrapKeyBindingCommand from '../WrapKeyBindingCommand/WrapKeyBindingCommand.ts'
import * as ViewletKeyBindings from './ViewletKeyBindings.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await KeyBindingsViewWorker.invoke('KeyBindings.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapKeyBindingCommand.wrapKeyBindingCommand(command)
  }

  Commands['hotReload'] = ViewletKeyBindings.hotReload
  return Commands
}
