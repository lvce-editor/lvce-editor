import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'
import * as WrapIframeInspectorCommand from '../WrapIframeInspectorCommand/WrapIframeInspectorCommand.ts'

export const Commands = {}

export const getCommands = async () => {
  // TODO
  const commands = await IframeInspectorWorker.invoke('IframeInspector.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapIframeInspectorCommand.wrapIframeInspectorCommand(command)
  }
  return Commands
}
