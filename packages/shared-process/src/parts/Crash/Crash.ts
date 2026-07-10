import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Timeout from '../Timeout/Timeout.ts'

const handleTimeout = (): any => {
  throw new Error('oops')
}

export const crashSharedProcess = (): any => {
  Timeout.setTimeout(handleTimeout, 0)
}

export const crashMainProcess = (): any => {
  return ParentIpc.invoke('Crash.crashMainProcess')
}
