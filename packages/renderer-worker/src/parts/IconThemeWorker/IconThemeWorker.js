import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchIconThemeWorker } from '../LaunchIconThemeWorker/LaunchIconThemeWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(launchIconThemeWorker)

export { invoke }
