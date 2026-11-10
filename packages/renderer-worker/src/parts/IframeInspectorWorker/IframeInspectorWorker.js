import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchIframeInspectorWorker from '../LaunchIframeInspectorWorker/LaunchIframeInspectorWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchIframeInspectorWorker.launchIframeInspectorWorker)

export { invoke, invokeAndTransfer, restart }
