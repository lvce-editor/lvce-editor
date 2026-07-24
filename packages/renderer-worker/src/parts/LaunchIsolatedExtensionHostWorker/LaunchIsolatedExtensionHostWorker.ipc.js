import * as LaunchIsolatedExtensionHostWorker from './LaunchIsolatedExtensionHostWorker.js'

export const name = 'LaunchIsolatedExtensionHostWorker'

export const Commands = {
  disposeIsolatedExtensionHostWorker: LaunchIsolatedExtensionHostWorker.disposeIsolatedExtensionHostWorker,
  launchIsolatedExtensionHostWorker: LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker,
}
