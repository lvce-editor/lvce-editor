import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatMessageParsingWorker } from '../LaunchChatMessageParsingWorker/LaunchChatMessageParsingWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatMessageParsingWorker)

export { invoke, invokeAndTransfer, restart }
