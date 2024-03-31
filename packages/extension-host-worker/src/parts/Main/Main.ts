import * as Api from '../Api/Api.js'
import * as Command from '../Command/Command.js'
import * as CommandMap from '../CommandMap/CommandMap.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as Rpc from '../Rpc/Rpc.js'
import * as SetStackTraceLimit from '../SetStackTraceLimit/SetStackTraceLimit.js'

export const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  onerror ||= ErrorHandling.handleUnhandledError
  onunhandledrejection ||= ErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    self.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }
  globalThis.vscode = Api.api
  Command.state.getFn = CommandMap.getFn
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  Rpc.listen(ipc)
}
