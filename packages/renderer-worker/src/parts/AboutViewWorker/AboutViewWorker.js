import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAboutViewWorker from '../LaunchAboutViewWorker/LaunchAboutViewWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchAboutViewWorker.launchAboutViewWorker)

export { invoke }
