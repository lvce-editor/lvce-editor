import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'

export const getFirstSpawnedProcessEvent = (childProcess: any): any => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: FirstNodeWorkerEventType.Error,
    exit: FirstNodeWorkerEventType.Exit,
  })
}
