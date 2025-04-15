import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchEditorWorker.launchEditorWorker)

const actualInvoke = invoke

export { actualInvoke as invoke, invokeAndTransfer }
