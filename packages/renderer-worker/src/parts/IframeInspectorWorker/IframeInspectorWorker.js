import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchIframeInspectorWorker from '../LaunchIframeInspectorWorker/LaunchIframeInspectorWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchIframeInspectorWorker.launchIframeInspectorWorker)

export { invoke }
