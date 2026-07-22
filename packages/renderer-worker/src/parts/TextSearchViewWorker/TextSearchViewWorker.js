import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextSearchViewWorker from '../LaunchTextSearchViewWorker/LaunchTextSearchViewWorker.js'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchTextSearchViewWorker.launchTextSearchViewWorker)

export { invoke, restart }
