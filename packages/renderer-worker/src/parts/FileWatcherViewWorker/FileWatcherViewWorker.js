import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchFileWatcherViewWorker from '../LaunchFileWatcherViewWorker/LaunchFileWatcherViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchFileWatcherViewWorker.launchFileWatcherViewWorker)

export { invoke, invokeAndTransfer, restart }
