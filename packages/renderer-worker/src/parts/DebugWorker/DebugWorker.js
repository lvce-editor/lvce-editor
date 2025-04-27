import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchDebugWorker from '../LaunchDebugWorker/LaunchDebugWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchDebugWorker.launchDebugWorker)

export { invoke, invokeAndTransfer, restart }
