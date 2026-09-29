import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchDialogWorker } from '../LaunchDialogWorker/LaunchDialogWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(launchDialogWorker)

export { invoke, invokeAndTransfer }
