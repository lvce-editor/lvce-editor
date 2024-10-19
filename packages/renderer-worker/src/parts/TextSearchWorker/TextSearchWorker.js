import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextSearchWorker from '../LaunchTextSearchWorker/LaunchTextSearchWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchTextSearchWorker.launchTextSearchWorker)

export { invoke, invokeAndTransfer }
