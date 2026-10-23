import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchAccountsViewWorker } from '../LaunchAccountsViewWorker/LaunchAccountsViewWorker.ts'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(launchAccountsViewWorker)

export { invoke, invokeAndTransfer }
