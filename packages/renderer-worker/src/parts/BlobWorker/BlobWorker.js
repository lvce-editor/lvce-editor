import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchBlobWorker from '../LaunchBlobWorker/LaunchBlobWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchBlobWorker.launchBlobWorker)

export { invoke }
