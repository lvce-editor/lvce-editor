import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExtensionSearchViewWorker from '../LaunchExtensionSearchViewWorker/LaunchExtensionSearchViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionSearchViewWorker.launchExtensionSearchViewWorker)

export { invoke, invokeAndTransfer, restart }
