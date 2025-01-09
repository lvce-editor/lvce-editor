import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchExplorerWorker from '../LaunchExplorerWorker/LaunchExplorerWorker.ts'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchExplorerWorker.launchExplorerWorker)

export { invoke, restart }
