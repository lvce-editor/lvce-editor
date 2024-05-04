import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchEmbedsWorker from '../LaunchEmbedsWorker/LaunchEmbedsWorker.js'

const { invoke, invokeAndTransfer, dispose } = GetOrCreateWorker.getOrCreateWorker(LaunchEmbedsWorker.launchEmbedsWorker)

export { dispose, invoke, invokeAndTransfer }
