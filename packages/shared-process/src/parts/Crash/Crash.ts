import * as Timeout from '../Timeout/Timeout.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

const handleTimeout = (): any => {
  throw new Error('oops')
}

export const crashSharedProcess = (): any => {
  Timeout.setTimeout(handleTimeout, 0)
}

export const crashMainProcess = (): any => {
  return ParentIpc.invoke('Crash.crashMainProcess')
}
