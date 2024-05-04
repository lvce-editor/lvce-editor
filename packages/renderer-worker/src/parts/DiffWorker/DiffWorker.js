import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchDiffWorker from '../LaunchDiffWorker/LaunchDiffWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchDiffWorker.launchDiffWorker)

export { invoke, invokeAndTransfer }
