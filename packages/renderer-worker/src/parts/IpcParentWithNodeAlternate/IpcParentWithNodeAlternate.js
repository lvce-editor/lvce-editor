import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const create = async (options) => {
  switch (Platform.platform) {
    case PlatformType.Web:
    case PlatformType.Remote:
      const module = await import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
      const rawIpc = await module.create(options)
      if (options.raw) {
        return rawIpc
      }
      return {
        rawIpc,
        module,
      }
    case PlatformType.Electron:
      const ipc = SharedProcessState.state.ipc
      const { port1, port2 } = new MessageChannel()
      const result = await JsonRpc.invokeAndTransfer(ipc, [port2], 'HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess')
      console.log({ result })
      return {}
    default:
      throw new Error('unsupported platform')
  }
}

export const wrap = ({ rawIpc, module }) => {
  return module.wrap(rawIpc)
}
