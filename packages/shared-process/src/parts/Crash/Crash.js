import * as Timeout from '../Timeout/Timeout.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

const handleTimeout = () => {
  throw new Error('oops')
}

export const crashSharedProcess = () => {
  Timeout.setTimeout(handleTimeout, 0)
}

export const crashMainProcess = () => {
  return ParentIpc.invoke('Crash.crashMainProcess')
}
