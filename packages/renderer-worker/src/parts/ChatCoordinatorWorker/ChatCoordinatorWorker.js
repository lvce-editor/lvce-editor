import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatCoordinatorWorker } from '../LaunchChatCoordinatorWorker/LaunchChatCoordinatorWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatCoordinatorWorker)

export { invoke, invokeAndTransfer, restart }
