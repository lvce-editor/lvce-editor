import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchProblemsWorker from '../LaunchProblemsWorker/LaunchProblemsWorker.ts'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchProblemsWorker.launchProblemsWorker)

export { invoke, invokeAndTransfer }
