import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchComponentStateWorker } from '../LaunchComponentStateWorker/LaunchComponentStateWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchComponentStateWorker)

export { invoke, invokeAndTransfer, restart }
