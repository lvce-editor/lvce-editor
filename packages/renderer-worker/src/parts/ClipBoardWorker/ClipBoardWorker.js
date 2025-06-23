import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchClipBoardWorker from '../LaunchClipBoardWorker/LaunchClipBoardWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchClipBoardWorker.launchClipBoardWorker)

export { invoke, invokeAndTransfer, restart }
