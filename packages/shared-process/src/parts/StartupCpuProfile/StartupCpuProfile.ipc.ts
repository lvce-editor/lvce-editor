import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const name = 'StartupCpuProfile'

export const Commands = {
  complete: (error = ''): Promise<unknown> => ParentIpc.invoke('StartupCpuProfile.complete', error),
}
