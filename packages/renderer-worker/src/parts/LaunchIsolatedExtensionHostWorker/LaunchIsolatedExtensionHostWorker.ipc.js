import * as LaunchIsolatedExtensionHostWorker from './LaunchIsolatedExtensionHostWorker.js'

export const name = 'LaunchIsolatedExtensionHostWorker'

export const Commands = {
  disposeIsolatedExtensionHostWorker: LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker,
  getMemoryUsage: LaunchIsolatedExtensionHostWorker.getMemoryUsage,
  launchIsolatedExtensionHostWorker: LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker,
}
