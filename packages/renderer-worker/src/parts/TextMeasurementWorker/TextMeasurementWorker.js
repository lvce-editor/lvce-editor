import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTextMeasurementWorker from '../LaunchTextMeasurementWorker/LaunchTextMeasurementWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchTextMeasurementWorker.launchTextMeasurementWorker)

export { invoke }
