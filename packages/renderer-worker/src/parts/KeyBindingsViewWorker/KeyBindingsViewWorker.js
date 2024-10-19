import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchKeyBindingsViewWorker from '../LaunchKeyBindingsViewWorker/LaunchKeyBindingsViewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchKeyBindingsViewWorker.launchKeyBindingsViewWorker)

export { invoke, invokeAndTransfer }
