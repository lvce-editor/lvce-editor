import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.js'

export const waitForProcessToExit = (childProcess) => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: ProcessExitEventType.Error,
    close: ProcessExitEventType.Exit,
  })
}
