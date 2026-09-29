import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatNetworkWorker } from '../LaunchChatNetworkWorker/LaunchChatNetworkWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatNetworkWorker)

export { invoke, invokeAndTransfer, restart }
