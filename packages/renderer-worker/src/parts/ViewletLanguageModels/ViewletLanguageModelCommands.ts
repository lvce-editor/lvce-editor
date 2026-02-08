import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'
import { wrapLanguageModelsCommand } from '../WrapLanguageModelsCommand/WrapLanguageModelsCommand.ts'
import { hotReload } from './ViewletLanguageModels.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await LanguageModelsViewWorker.invoke('LanguageModels.getCommandIds')
  for (const command of commands) {
    Commands[command] = wrapLanguageModelsCommand(command)
  }
  Commands['hotReload'] = hotReload

  return Commands
}
