import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

/**
 *
 * @param {import('worker_threads').Worker} worker
 * @returns
 */
export const getFirstNodeWorkerEvent = (worker) => {
  return GetFirstEvent.getFirstEvent(worker, {
    message: FirstNodeWorkerEventType.Message,
    exit: FirstNodeWorkerEventType.Exit,
    error: FirstNodeWorkerEventType.Error,
  })
}
