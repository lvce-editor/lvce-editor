import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchChatMathWorker } from '../LaunchChatMathWorker/LaunchChatMathWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchChatMathWorker)

export { invoke, invokeAndTransfer, restart }
