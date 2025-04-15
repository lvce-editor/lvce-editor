import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchErrorWorker from '../LaunchErrorWorker/LaunchErrorWorker.ts'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchErrorWorker.launchErrorWorker)

export { invoke, invokeAndTransfer }
