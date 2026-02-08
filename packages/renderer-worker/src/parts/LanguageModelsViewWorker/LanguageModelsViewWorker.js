import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchLanguageModelsViewWorker } from '../LaunchLanguageModelsViewWorker/LaunchLanguageModelsViewWorker.js'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(launchLanguageModelsViewWorker)

export { invoke, restart }
