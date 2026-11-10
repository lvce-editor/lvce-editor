import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchPortsViewWorker } from '../LaunchPortsViewWorker/LaunchPortsViewWorker.ts'

const worker = GetOrCreateWorker.getOrCreateWorker(launchPortsViewWorker)

export const invoke = worker.invoke.bind(worker)
export const invokeAndTransfer = worker.invokeAndTransfer.bind(worker)
export const restart = worker.restart.bind(worker)
