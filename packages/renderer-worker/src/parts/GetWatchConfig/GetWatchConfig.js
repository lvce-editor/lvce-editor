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
  const titleBarWorkerPath = Preferences.get('develop.titleBarWorkerPath')
  if (titleBarWorkerPath) {
    watchConfig.push({
      path: titleBarWorkerPath,
      command: 'TitleBar.hotReload',
    })
  }
  const languageModelsWorkerPath = Preferences.get('develop.languageModelsViewPath')
  if (languageModelsWorkerPath) {
    watchConfig.push({
      path: languageModelsWorkerPath,
      command: 'LanguageModels.hotReload',
    })
  }
  const mainAreaWorkerPath = Preferences.get('develop.mainAreaWorkerPath')
  if (mainAreaWorkerPath) {
    watchConfig.push({
      path: mainAreaWorkerPath,
      command: 'Main.hotReload',
    })
  }
  const statusBarWorkerPath = Preferences.get('develop.statusBarWorkerPath')
  if (statusBarWorkerPath) {
    watchConfig.push({
      path: statusBarWorkerPath,
      command: 'StatusBar.hotReload',
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
      command: 'Source Control.hotReload',
    })
  }
  const debug = Preferences.get('develop.debugWorkerPath')
  if (debug) {
    watchConfig.push({
      path: debug,
      command: 'Run And Debug.hotReload',
    })
  }
  const clipBoard = Preferences.get('develop.clipBoardWorkerPath')
  if (clipBoard) {
    watchConfig.push({
      path: clipBoard,
      command: 'ClipBoard.hotReload',
    })
  }
  const activityBar = Preferences.get('develop.activityBarWorkerPath')
  if (activityBar) {
    watchConfig.push({
      path: activityBar,
      command: 'ActivityBar.hotReload',
    })
  }
  const references = Preferences.get('develop.referencesWorkerPath')
  if (references) {
    watchConfig.push({
      path: references,
      command: 'Locations.hotReload',
    })
  }
  const settings = Preferences.get('develop.settingsWorkerPath')
  if (settings) {
    watchConfig.push({
      path: settings,
      command: 'Settings.hotReload',
    })
  }
  const output = Preferences.get('develop.outputViewWorkerPath')
  if (output) {
    watchConfig.push({
      path: output,
      command: 'Output.hotReload',
    })
  }
  const find = Preferences.get('develop.findWidgetWorkerPath')
  if (find) {
    watchConfig.push({
      path: find,
      command: 'Editor.hotReload',
    })
  }
  return watchConfig
}
