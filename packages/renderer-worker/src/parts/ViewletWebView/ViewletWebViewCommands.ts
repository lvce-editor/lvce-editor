import * as IframeWorker from '../IframeWorker/IframeWorker.js'
import * as WrapIframeCommand from '../WrapIframeCommand/WrapIframeCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await IframeWorker.invoke('WebView.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapIframeCommand.wrapIframeCommand(command)
  }
  // Commands['hotReload'] = ViewletWebView.hotReload

  return Commands
}
