import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchActivityBarWorker from '../LaunchActivityBarWorker/LaunchActivityBarWorker.ts'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchActivityBarWorker.launchActivityBarWorker)

export { invoke, restart }
