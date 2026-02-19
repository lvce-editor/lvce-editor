import * as PanelWorker from '../PanelWorker/PanelWorker.js'
import * as WrapPanelCommand from '../WrapPanelCommand/WrapPanelCommand.ts'
import * as ViewletPanel from '../ViewletPanel/ViewletPanel.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await PanelWorker.invoke('Panel.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapPanelCommand.wrapPanelCommand(command)
  }
  Commands['hotReload'] = ViewletPanel.hotReload

  return Commands
}
