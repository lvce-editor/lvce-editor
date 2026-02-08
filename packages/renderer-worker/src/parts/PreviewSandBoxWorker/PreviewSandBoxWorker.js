import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchPreviewSandBoxWorker } from '../LaunchPreviewSandBoxWorker/LaunchPreviewSandBoxWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchPreviewSandBoxWorker)

export { invoke, invokeAndTransfer, restart }
