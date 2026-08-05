import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchDragAndDropWorker from '../LaunchDragAndDropWorker/LaunchDragAndDropWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchDragAndDropWorker.launchDragAndDropWorker)

export { invoke, invokeAndTransfer }
