import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'
import type { EditorWorkerApi } from '@lvce-editor/editor-worker/dist/api/api.d.ts'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchEditorWorker.launchEditorWorker)

const actualInvoke = invoke as EditorWorkerApi['invoke']

export { actualInvoke as invoke, invokeAndTransfer }
