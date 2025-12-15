import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchIframeWorker from '../LaunchIframeWorker/LaunchIframeWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchIframeWorker.launchIframeWorker)

export { invoke, invokeAndTransfer }
