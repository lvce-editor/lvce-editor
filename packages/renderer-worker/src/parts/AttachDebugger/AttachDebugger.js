import * as Assert from '../Assert/Assert.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const attachDebugger = async (pid) => {
  Assert.number(pid)
  await SharedProcess.invoke('AttachDebugger.attachDebugger', pid)
}
