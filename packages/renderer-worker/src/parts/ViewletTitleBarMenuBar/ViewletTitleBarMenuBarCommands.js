import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as WrapTextSearchCommand from './WrapTitleBarMenuBarCommand.js'
import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TitleBarWorker.invoke('TitleBarMenuBar.getCommands')
  for (const command of commands) {
    Commands[command] = WrapTextSearchCommand.wrapTitleBarMenuBarCommand(command)
  }

  Commands['hotReload'] = ViewletTitleBarMenuBar.hotReload
  return Commands
}

export const saveState = (state) => {
  return TitleBarWorker.invoke(`TitleBarMenuBar.saveState`, state.uid)
}
