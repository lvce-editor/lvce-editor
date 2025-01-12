import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextSearchWorker from '../LaunchTextSearchWorker/LaunchTextSearchWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchTextSearchWorker.launchTextSearchWorker)

export { invoke, invokeAndTransfer, restart }
