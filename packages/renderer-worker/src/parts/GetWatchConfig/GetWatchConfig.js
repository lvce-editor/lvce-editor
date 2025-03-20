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
  return watchConfig
}
