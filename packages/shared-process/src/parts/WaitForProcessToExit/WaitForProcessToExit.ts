import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'

export const waitForProcessToExit = (childProcess: any): any => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: ProcessExitEventType.Error,
    close: ProcessExitEventType.Exit,
  })
}
