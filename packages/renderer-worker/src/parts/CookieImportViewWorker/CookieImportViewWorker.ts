import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchCookieImportViewWorker } from '../LaunchCookieImportViewWorker/LaunchCookieImportViewWorker.ts'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(launchCookieImportViewWorker)

export { invoke, invokeAndTransfer, restart }
