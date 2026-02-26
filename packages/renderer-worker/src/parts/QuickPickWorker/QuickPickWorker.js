import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchQuickPickWorker } from '../LaunchQuickPickWorker/LaunchQuickPickWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(launchQuickPickWorker)

export { invoke }
