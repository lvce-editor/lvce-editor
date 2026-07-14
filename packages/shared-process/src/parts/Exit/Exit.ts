import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const exit = (code?: number): any => {
  if (code === undefined) {
    return ParentIpc.invoke('Exit.exit')
  }
  return ParentIpc.invoke('Exit.exit', code)
}
