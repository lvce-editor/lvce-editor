import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchOpenerWorker } from '../LaunchOpenerWorker/LaunchOpenerWorker.ts'

const { invoke, restart, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(launchOpenerWorker)

export { invoke, restart, invokeAndTransfer }
