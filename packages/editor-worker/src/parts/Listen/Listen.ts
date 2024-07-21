import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandState from '../CommandState/CommandState.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const listen = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  HandleIpc.handleIpc(ipc)
  Rpc.listen(ipc)
  await RendererProcess.listen()
  await ExtensionHostWorker.listen()
  const uri = '/test/file.js'
  const editorId = 1
  const languageId = 'javascript'
  const text = 'abc'
  await ExtensionHostWorker.invoke('ExtensionHostTextDocument.syncFull', uri, editorId, languageId, text)
  await ExtensionHostWorker.invoke('ExtensionHostReference.executeFileReferenceProvider', editorId, 0)
  console.log('list ext host worker')
}
