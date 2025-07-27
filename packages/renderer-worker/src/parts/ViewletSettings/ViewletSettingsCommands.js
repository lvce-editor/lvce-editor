import * as SettingsWorker from '../SettingsWorker/SettingsWorker.ts'
import * as ViewletSettings from '../ViewletSettings/ViewletSettings.js'
import * as WrapSettingsCommand from '../WrapSettingsCommand/WrapSettingsCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await SettingsWorker.invoke('Settings.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapSettingsCommand.wrapSettingsCommand(command)
  }
  Commands['hotReload'] = ViewletSettings.hotReload
  return Commands
}
