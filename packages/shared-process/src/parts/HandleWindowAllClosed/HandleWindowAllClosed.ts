import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Platform from '../Platform/Platform.ts'

export const handleWindowAllClosed = async () => {
  if (!Platform.isMacOs) {
    await ParentIpc.invoke('Exit.exit')
  }
}
