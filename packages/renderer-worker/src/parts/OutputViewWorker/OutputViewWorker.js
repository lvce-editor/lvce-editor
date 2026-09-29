import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchOutputViewWorker from '../LaunchOutputViewWorker/LaunchOutputViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchOutputViewWorker.launchOutputViewWorker)

export { invoke, invokeAndTransfer, restart }
