import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchCacheWorker from '../LaunchCacheWorker/LaunchCacheWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchCacheWorker.launchCacheWorker)

export { invoke, invokeAndTransfer }
