import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as WrapActivityBarCommand from '../WrapActivityBarCommand/WrapActivityBarCommand.ts'
import * as ViewletActivityBar from '../ViewletActivityBar/ActivityBarState.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await ActivityBarWorker.invoke('ActivityBar.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapActivityBarCommand.wrapActivityBarCommand(command)
  }
  Commands['hotReload'] = ViewletActivityBar.hotReload

  return Commands
}
