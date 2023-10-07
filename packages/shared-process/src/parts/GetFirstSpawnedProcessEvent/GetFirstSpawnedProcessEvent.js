import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const getFirstSpawnedProcessEvent = (childProcess) => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: FirstNodeWorkerEventType.Error,
    exit: FirstNodeWorkerEventType.Exit,
  })
}
