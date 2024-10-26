import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExtensionSearchViewWorker from '../LaunchExtensionSearchViewWorker/LaunchExtensionSearchViewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionSearchViewWorker.launchExtensionSearchViewWorker)

export { invoke, invokeAndTransfer }
