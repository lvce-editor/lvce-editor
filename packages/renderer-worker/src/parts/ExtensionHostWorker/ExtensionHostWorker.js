import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionHostWorker.launchExtensionHostWorker)

export { invoke, invokeAndTransfer }
