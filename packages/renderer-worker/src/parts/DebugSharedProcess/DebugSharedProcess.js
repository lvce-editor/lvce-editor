import * as AttachDebugger from '../AttachDebugger/AttachDebugger.js'
import * as Process from '../Process/Process.js'

export const debugSharedProcess = async () => {
  const pid = await Process.getPid()
  await AttachDebugger.attachDebugger(pid)
}
