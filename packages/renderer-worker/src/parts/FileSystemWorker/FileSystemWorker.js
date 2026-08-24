import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchFileSystemWorker from '../LaunchFileSystemWorker/LaunchFileSystemWorker.js'

const { dispose, invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchFileSystemWorker.launchFileSystemWorker)

export { dispose, invoke, invokeAndTransfer, restart }
