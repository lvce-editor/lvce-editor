import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchOutputViewWorker from '../LaunchOutputViewWorker/LaunchOutputViewWorker.js'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchOutputViewWorker.launchOutputViewWorker)

export { invoke, restart }
