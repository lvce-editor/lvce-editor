import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchSecretsViewWorker } from '../LaunchSecretsViewWorker/LaunchSecretsViewWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchSecretsViewWorker)

export { invoke, invokeAndTransfer, restart }
