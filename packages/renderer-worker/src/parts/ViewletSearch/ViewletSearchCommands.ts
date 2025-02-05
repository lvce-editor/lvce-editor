import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as WrapTextSearchCommand from './WrapTextSearchCommand.ts'
import * as ViewletSearch from './ViewletSearch.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TextSearchWorker.invoke('TextSearch.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapTextSearchCommand.wrapTextSearchCommand(command)
  }

  Commands['hotReload'] = ViewletSearch.hotReload
  return Commands
}

export const saveState = (state) => {
  return TextSearchWorker.invoke(`TextSearch.saveState`, state.uid)
}
