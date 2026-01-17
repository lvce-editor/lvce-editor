import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchMainAreaBarWorker } from '../LaunchMainAreaWorker/LaunchMainAreaWorker.ts'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(launchMainAreaBarWorker)

export { invoke, restart }
