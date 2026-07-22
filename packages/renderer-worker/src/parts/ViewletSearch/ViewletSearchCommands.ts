import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'
import * as WrapTextSearchCommand from './WrapTextSearchCommand.ts'
import * as ViewletSearch from './ViewletSearch.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TextSearchViewWorker.invoke('TextSearch.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapTextSearchCommand.wrapTextSearchCommand(command)
  }

  Commands['hotReload'] = ViewletSearch.hotReload
  return Commands
}

export const saveState = (state) => {
  return TextSearchViewWorker.invoke(`TextSearch.saveState`, state.uid)
}
