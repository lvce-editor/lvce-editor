import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchEditorWorker.launchEditorWorker)

export { invoke, invokeAndTransfer }
