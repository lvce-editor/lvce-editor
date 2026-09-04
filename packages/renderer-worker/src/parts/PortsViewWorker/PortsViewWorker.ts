import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchPortsViewWorker } from '../LaunchPortsViewWorker/LaunchPortsViewWorker.ts'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(launchPortsViewWorker)

export { invoke, restart }
