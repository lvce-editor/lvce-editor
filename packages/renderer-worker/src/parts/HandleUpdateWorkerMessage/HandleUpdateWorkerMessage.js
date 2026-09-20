import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.js'

const execute = (method, ...params) => UpdateDiagnostics.run(method, () => Command.execute(method, ...params))

export const handleMessage = (event) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(event.target, event.data, execute, Callback.resolve, 'update worker')
}
