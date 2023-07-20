import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

export const waitForProcessToExit = async (childProcess) => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: ProcessExitEventType.Error,
    exit: ProcessExitEventType.Exit,
  })
}
