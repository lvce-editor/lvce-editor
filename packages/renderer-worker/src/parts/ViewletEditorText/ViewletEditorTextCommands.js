import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as WrapStatusBarCommand from '../WrapStatusBarCommand/WrapStatusBarCommand.ts'
import * as ViewletStatusBar from '../ViewletStatusBar/ViewletStatusBar.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await EditorWorker.invoke('Editor.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapStatusBarCommand.wrapStatusBarCommand(command)
  }
  Commands['hotReload'] = ViewletStatusBar.hotReload

  return Commands
}
