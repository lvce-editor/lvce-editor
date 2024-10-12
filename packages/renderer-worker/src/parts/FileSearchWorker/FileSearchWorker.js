import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchFileSearchWorker from '../LaunchFileSearchWorker/LaunchFileSearchWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchFileSearchWorker.launchFileSearchWorker)

export { invoke, invokeAndTransfer }
