import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAboutViewWorker from '../LaunchAboutViewWorker/LaunchAboutViewWorker.js'

const { dispose, invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchAboutViewWorker.launchAboutViewWorker)

export { dispose, invoke, invokeAndTransfer }
