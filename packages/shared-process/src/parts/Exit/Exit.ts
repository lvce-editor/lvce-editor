import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const exit = (): any => {
  return ParentIpc.invoke('Exit.exit')
}
