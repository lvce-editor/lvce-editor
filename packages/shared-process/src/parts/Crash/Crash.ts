import * as Timeout from '../Timeout/Timeout.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

const handleTimeout = () => {
  throw new Error('oops')
}

export const crashSharedProcess = () => {
  Timeout.setTimeout(handleTimeout, 0)
}

export const crashMainProcess = () => {
  return ParentIpc.invoke('Crash.crashMainProcess')
}
