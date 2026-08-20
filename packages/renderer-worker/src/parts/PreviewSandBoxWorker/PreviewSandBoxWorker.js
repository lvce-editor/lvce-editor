import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchPreviewSandBoxWorker } from '../LaunchPreviewSandBoxWorker/LaunchPreviewSandBoxWorker.js'

const { dispose, invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchPreviewSandBoxWorker)

export { dispose, invoke, invokeAndTransfer, restart }
