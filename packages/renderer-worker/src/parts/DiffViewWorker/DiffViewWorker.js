import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchDiffViewWorker from '../LaunchDiffViewWorker/LaunchDiffViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchDiffViewWorker.launchDiffViewWorker)

export { invoke, invokeAndTransfer, restart }
