import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as LaunchExtensionManagementWorker from '../LaunchExtensionManagementWorker/LaunchExtensionManagementWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchExtensionManagementWorker.launchExtensionManagementWorker)

export { invoke, invokeAndTransfer, restart }

const disposeAllRuntimes = () => {
  return invoke('Extensions.disposeAllRuntimes')
}

export const hydrate = () => {
  GlobalEventBus.addListener('workspace.beforeChange', disposeAllRuntimes)
}
