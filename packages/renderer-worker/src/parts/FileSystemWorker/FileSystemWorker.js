import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchFileSystemWorker from '../LaunchFileSystemWorker/LaunchFileSystemWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchFileSystemWorker.launchFileSystemWorker)

export { invoke, invokeAndTransfer, restart }
