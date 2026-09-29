import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatViewModelWorker } from '../LaunchChatViewModelWorker/LaunchChatViewModelWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatViewModelWorker)

export { invoke, invokeAndTransfer, restart }
