import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchSourceControlWorker from '../LaunchSourceControlWorker/LaunchSourceControlWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchSourceControlWorker.launchSourceControlWorker)

export { invoke, invokeAndTransfer, restart }
