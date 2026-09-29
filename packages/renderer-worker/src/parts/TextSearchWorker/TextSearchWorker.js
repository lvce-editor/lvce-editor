import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextSearchWorker from '../LaunchTextSearchWorker/LaunchTextSearchWorker.js'

const { dispose, invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchTextSearchWorker.launchTextSearchWorker)

export { dispose, invoke, invokeAndTransfer, restart }
