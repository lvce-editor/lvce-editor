import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Platform from '../Platform/Platform.ts'

export const handleWindowAllClosed = async (): Promise<any> => {
  if (!Platform.isMacOs) {
    await ParentIpc.invoke('Exit.exit')
  }
}
