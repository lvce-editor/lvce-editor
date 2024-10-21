import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAboutViewWorker from '../LaunchAboutViewWorker/LaunchAboutViewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchAboutViewWorker.launchKeyBindingsViewWorker)

export { invoke, invokeAndTransfer }
