import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

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
