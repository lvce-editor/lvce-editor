import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const exit = () => {
  return ParentIpc.invoke('Exit.exit')
}
