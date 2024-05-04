import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTerminalWorker from '../LaunchTerminalWorker/LaunchTerminalWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchTerminalWorker.launchTerminalWorker)

export { invoke, invokeAndTransfer }
