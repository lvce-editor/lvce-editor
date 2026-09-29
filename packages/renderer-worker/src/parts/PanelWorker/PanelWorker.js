import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchPanelWorker } from '../LaunchPanelWorker/LaunchPanelWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchPanelWorker)

export { invoke, invokeAndTransfer, restart }
