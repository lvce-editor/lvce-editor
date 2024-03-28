import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as TerminalProcessState from '../TerminalProcessState/TerminalProcessState.ts'

export const listen = async () => {
  console.log('setup terminal connection')
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(TerminalProcessState.state.ipc, method, ...params)
}

export const send = (method, ...params) => {
  return JsonRpc.send(TerminalProcessState.state.ipc, method, ...params)
}
