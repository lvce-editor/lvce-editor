import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatToolWorker } from '../LaunchChatToolWorker/LaunchChatToolWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatToolWorker)

export { invoke, invokeAndTransfer, restart }
