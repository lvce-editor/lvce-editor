import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatViewWorker } from '../LaunchChatViewWorker/LaunchChatViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatViewWorker)

export { invoke, invokeAndTransfer, restart }
