import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchIframeWorker from '../LaunchIframeWorker/LaunchIframeWorker.js'

const { invoke, invokeAndTransfer, isCreated } = GetOrCreateWorker.getOrCreateWorker(LaunchIframeWorker.launchIframeWorker)

export { invoke, invokeAndTransfer, isCreated }
