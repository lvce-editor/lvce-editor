import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchPreviewWorker from '../LaunchPreviewWorker/LaunchPreviewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchPreviewWorker.launchPreviewWorker)

export { invoke, invokeAndTransfer }
