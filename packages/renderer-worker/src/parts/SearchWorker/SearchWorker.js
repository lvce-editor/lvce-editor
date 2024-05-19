import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchSearchWorker from '../LaunchSearchWorker/LaunchSearchWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchSearchWorker.launchSearchWorker)

export { invoke, invokeAndTransfer }
