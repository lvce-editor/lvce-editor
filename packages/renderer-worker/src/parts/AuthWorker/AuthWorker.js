import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAuthWorker from '../LaunchAuthWorker/LaunchAuthWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchAuthWorker.launchAuthWorker)

export { invoke, invokeAndTransfer, restart }
