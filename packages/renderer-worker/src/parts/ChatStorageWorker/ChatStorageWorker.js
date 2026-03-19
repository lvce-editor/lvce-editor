import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatStorageWorker } from '../LaunchChatStorageWorker/LaunchChatStorageWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatStorageWorker)

export { invoke, invokeAndTransfer, restart }
