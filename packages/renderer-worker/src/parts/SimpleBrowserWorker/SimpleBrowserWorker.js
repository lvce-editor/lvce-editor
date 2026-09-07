import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchSimpleBrowserWorker from '../LaunchSimpleBrowserWorker/LaunchSimpleBrowserWorker.js'

export const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchSimpleBrowserWorker.launchSimpleBrowserWorker)
