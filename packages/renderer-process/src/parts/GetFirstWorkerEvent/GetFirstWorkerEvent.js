import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

/**
 *
 * @param {Worker} worker
 * @returns
 */
export const getFirstWorkerEvent = (worker) => {
  return GetFirstEvent.getFirstEvent(worker, {
    message: FirstWorkerEventType.Message,
    error: FirstWorkerEventType.Error,
  })
}
