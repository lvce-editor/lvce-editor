import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchTaskWorker } from '../LaunchTaskWorker/LaunchTaskWorker.js'

const { invoke, invokeAndTransfer, isCreated, restart } = GetOrCreateWorker.getOrCreateWorker(launchTaskWorker)

export { invoke, invokeAndTransfer, isCreated, restart }
