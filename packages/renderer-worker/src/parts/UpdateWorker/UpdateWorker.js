import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchUpdateWorker } from '../LaunchUpdateWorker/LaunchUpdateWorker.js'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.js'

const worker = GetOrCreateWorker.getOrCreateWorker(launchUpdateWorker)

export const invoke = (method, ...params) => UpdateDiagnostics.run(method, () => worker.invoke(method, ...params))
