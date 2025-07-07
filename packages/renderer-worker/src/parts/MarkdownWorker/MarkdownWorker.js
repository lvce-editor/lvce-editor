import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchMarkdownWorker from '../LaunchMarkdownWorker/LaunchMarkdownWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchMarkdownWorker.launchMarkdownWorker)

export { invoke, invokeAndTransfer }
