import * as Api from '../Api/Api.ts'
import * as Command from '../Command/Command.ts'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as SetStackTraceLimit from '../SetStackTraceLimit/SetStackTraceLimit.ts'

export const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  onerror ||= ErrorHandling.handleUnhandledError
  onunhandledrejection ||= ErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    self.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }
  globalThis.vscode = Api.api
  // @ts-ignore
  Command.state.getFn = CommandMap.getFn
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  Rpc.listen(ipc)
}
