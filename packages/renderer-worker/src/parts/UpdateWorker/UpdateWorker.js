import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchUpdateWorker } from '../LaunchUpdateWorker/LaunchUpdateWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(launchUpdateWorker)

export { invoke }
