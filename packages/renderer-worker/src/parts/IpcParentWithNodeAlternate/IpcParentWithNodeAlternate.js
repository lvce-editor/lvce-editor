import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
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
      const { message, promise } = JsonRpcRequest.create('HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess', [])
      const { port1, port2 } = new MessageChannel()
      ipc.sendAndTransfer(message, port2)
      const result = await promise
      console.log({ result })
      return {}
    default:
      throw new Error('unsupported platform')
  }
}

export const wrap = ({ rawIpc, module }) => {
  return module.wrap(rawIpc)
}
