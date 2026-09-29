import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchLanguageModelsViewWorker } from '../LaunchLanguageModelsViewWorker/LaunchLanguageModelsViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchLanguageModelsViewWorker)

export { invoke, invokeAndTransfer, restart }
