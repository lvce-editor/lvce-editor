import * as Preferences from '../Preferences/Preferences.js'

export const getWatchConfig = () => {
  const watchConfig = []
  const explorerPath = Preferences.get('develop.explorerWorkerPath')
  if (explorerPath) {
    watchConfig.push({
      path: explorerPath,
      command: 'Explorer.hotReload',
    })
  }
  const textSearchWorkerPath = Preferences.get('develop.textSearchWorkerPath')
  if (textSearchWorkerPath) {
    watchConfig.push({
      path: textSearchWorkerPath,
      command: 'Search.hotReload',
    })
  }
  const extensionDetail = Preferences.get('develop.extensionDetailViewWorkerPath')
  if (extensionDetail) {
    watchConfig.push({
      path: extensionDetail,
      command: 'ExtensionDetail.hotReload',
    })
  }
  const extensionSearchViewWorkerPath = Preferences.get('develop.extensionSearchViewWorkerPath')
  if (extensionDetail) {
    watchConfig.push({
      path: extensionSearchViewWorkerPath,
      command: 'Extensions.hotReload',
    })
  }
  const iframeInspector = Preferences.get('develop.iframeInspectorWorkerPath')
  if (iframeInspector) {
    watchConfig.push({
      path: iframeInspector,
      command: 'IframeInspector.hotReload',
    })
  }
  const keyBindings = Preferences.get('develop.keyBindingsViewWorkerPath')
  if (keyBindings) {
    watchConfig.push({
      path: keyBindings,
      command: 'KeyBindings.hotReload',
    })
  }
  const sourceControl = Preferences.get('develop.sourceControlWorkerPath')
  if (sourceControl) {
    watchConfig.push({
      path: sourceControl,
      command: 'SourceControl.hotReload',
    })
  }
  const debug = Preferences.get('develop.debugWorkerPath')
  if (debug) {
    watchConfig.push({
      path: debug,
      command: 'Run And Debug.hotReload',
    })
  }
  return watchConfig
}
