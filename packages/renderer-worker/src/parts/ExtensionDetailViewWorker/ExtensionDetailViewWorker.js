import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExtensionDetailViewWorker from '../LaunchExtensionDetailViewWorker/LaunchExtensionDetailViewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionDetailViewWorker.launchExtensionDetailViewWorker)

export { invoke, invokeAndTransfer }
