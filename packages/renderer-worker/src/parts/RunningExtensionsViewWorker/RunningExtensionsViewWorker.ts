import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchRunningExtensionsViewWorker } from '../LaunchRunningExtensionsViewWorker/LaunchRunningExtensionsViewWorker.ts'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(launchRunningExtensionsViewWorker)

export { invoke, restart }
