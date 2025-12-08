import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchStatusBarWorker } from '../LaunchStatusBarWorker/LaunchStatusBarWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchStatusBarWorker)

export { invoke, invokeAndTransfer, restart }
