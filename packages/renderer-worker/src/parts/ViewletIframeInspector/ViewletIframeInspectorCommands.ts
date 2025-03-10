import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'
import * as WrapAboutCommand from '../WrapAboutCommand/WrapAboutCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  // TODO
  const commands = await IframeInspectorWorker.invoke('IframeInspector.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapAboutCommand.wrapAboutCommand(command)
  }
  return Commands
}
