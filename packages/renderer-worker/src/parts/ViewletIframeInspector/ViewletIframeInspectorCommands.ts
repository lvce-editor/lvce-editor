import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'
import * as WrapIframeInspectorCommand from '../WrapIframeInspectorCommand/WrapIframeInspectorCommand.ts'
import * as ViewletIframeInspector from '../ViewletIframeInspector/ViewletIframeInspector.ts'

export const Commands = {}

export const getCommands = async () => {
  const commands = await IframeInspectorWorker.invoke('IframeInspector.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapIframeInspectorCommand.wrapIframeInspectorCommand(command)
  }
  Commands['hotReload'] = ViewletIframeInspector.hotReload
  return Commands
}
