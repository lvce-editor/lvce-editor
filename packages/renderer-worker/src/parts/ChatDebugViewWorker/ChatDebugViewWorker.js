import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatDebugViewWorker } from '../LaunchChatDebugViewWorker/LaunchChatDebugViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatDebugViewWorker)

export { invoke, invokeAndTransfer, restart }
