import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchRunningExtensionsViewWorker } from '../LaunchRunningExtensionsViewWorker/LaunchRunningExtensionsViewWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(launchRunningExtensionsViewWorker)

export { invoke }
