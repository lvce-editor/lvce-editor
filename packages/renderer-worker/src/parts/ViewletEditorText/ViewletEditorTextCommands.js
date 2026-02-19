import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as ViewletStatusBar from '../ViewletStatusBar/ViewletStatusBar.js'
import { wrapEditorCommand } from '../WrapEditorCommand/WrapEditorCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await EditorWorker.invoke('Editor.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapEditorCommand(command)
  }
  Commands['hotReload'] = ViewletStatusBar.hotReload

  return Commands
}
