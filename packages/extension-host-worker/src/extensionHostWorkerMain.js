import * as Api from './parts/Api/Api.js'
import * as Command from './parts/Command/Command.js'
import * as CommandMap from './parts/CommandMap/CommandMap.js'
import * as ErrorHandling from './parts/ErrorHandling/ErrorHandling.js'
import * as HandleContentSecurityPolicyViolation from './parts/HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'
import * as SetStackTraceLimit from './parts/SetStackTraceLimit/SetStackTraceLimit.js'

const main = async () => {
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

main()
