import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchProcessExplorerWorker from '../LaunchProcessExplorerWorker/LaunchProcessExplorerWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchProcessExplorerWorker.launchProcessExplorerWorker)

export { invoke, invokeAndTransfer, restart }
