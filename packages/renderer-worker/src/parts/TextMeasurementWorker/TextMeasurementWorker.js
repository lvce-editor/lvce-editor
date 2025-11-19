import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextMeasurementWorker from '../LaunchTextMeasurementWorker/LaunchTextMeasurementWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchTextMeasurementWorker.launchTextMeasurementWorker)

export { invoke, invokeAndTransfer }
