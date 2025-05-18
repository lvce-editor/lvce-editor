import * as ParentIpc from '../MainProcess/MainProcess.js'

export const exit = () => {
  return ParentIpc.invoke('Exit.exit')
}
