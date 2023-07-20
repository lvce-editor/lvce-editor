import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

export const getFirstNodeWorkerEvent = (worker) => {
  return GetFirstEvent.getFirstEvent(worker, {
    exit: FirstNodeWorkerEventType.Exit,
    error: FirstNodeWorkerEventType.Error,
  })
}
