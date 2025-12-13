import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExtensionManagementWorker from '../LaunchExtensionManagementWorker/LaunchExtensionManagementWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionManagementWorker.launchExtensionManagementWorker)

export { invoke, invokeAndTransfer, restart }
