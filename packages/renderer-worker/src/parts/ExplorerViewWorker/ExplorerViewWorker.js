import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExplorerWorker from '../LaunchExplorerWorker/LaunchExplorerWorker.ts'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchExplorerWorker.launchExplorerWorker)

export { invoke }
