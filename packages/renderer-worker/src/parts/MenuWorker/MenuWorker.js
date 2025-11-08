import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchMenuWorker from '../LaunchMenuWorker/LaunchMenuWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchMenuWorker.launchMenuWorker)

export { invoke }
