import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchMainAreaWorker } from '../LaunchMainAreaWorker/LaunchMainAreaWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchMainAreaWorker)

export { invoke, invokeAndTransfer, restart }
