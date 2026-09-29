import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchWorkersViewWorker } from '../LaunchWorkersViewWorker/LaunchWorkersViewWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchWorkersViewWorker)

export { invoke, invokeAndTransfer, restart }
