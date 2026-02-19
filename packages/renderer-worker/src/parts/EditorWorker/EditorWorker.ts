import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchEditorWorker.launchEditorWorker)

const actualInvoke = invoke

export { actualInvoke as invoke, invokeAndTransfer, restart }
