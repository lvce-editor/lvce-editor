import * as TextMeasurementWorkerUrl from '../TextMeasurementWorkerUrl/TextMeasurementWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchTextMeasurementWorker = async () => {
  const name = 'Text Measurement Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.textMeasurementWorkerPath', TextMeasurementWorkerUrl.textMeasurementWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
