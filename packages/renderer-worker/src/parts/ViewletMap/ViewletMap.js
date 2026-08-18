import * as Path from '../Path/Path.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as GetExtensionViews from '../GetExtensionViews/GetExtensionViews.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

// TODO move this all to extensions

const mapExtToEditorType = {
  '.mp3': ViewletModuleId.Audio,
  '.ogg': ViewletModuleId.Audio,
  '.opus': ViewletModuleId.Audio,
}

const getModuleIdForOpener = async (opener) => {
  if (!opener) {
    return undefined
  }
  const extensionViews = await GetExtensionViews.getExtensionViews()
  if (GetExtensionViews.findExtensionView(extensionViews, opener)) {
    return ViewletModuleId.ExtensionView
  }
  const webViews = await GetWebViews.getWebViews()
  if (webViews.some((webView) => webView?.id === opener)) {
    return ViewletModuleId.WebView
  }
  return undefined
}

export const getModuleId = async (uri, opener) => {
  // TODO rename scheme to keybindings://
  if (uri === 'app://keybindings') {
    return ViewletModuleId.KeyBindings
  }
  if (uri.startsWith('extension-detail://')) {
    return ViewletModuleId.ExtensionDetail
  }
  if (uri.startsWith('chat-debug://')) {
    return ViewletModuleId.ChatDebug
  }
  if (uri.startsWith('language-models://')) {
    return ViewletModuleId.LanguageModels
  }
  if (uri.startsWith('settings://')) {
    return ViewletModuleId.Settings
  }
  if (uri.startsWith('process-explorer://')) {
    return ViewletModuleId.ProcessExplorer
  }
  if (uri.startsWith('running-extensions://')) {
    return ViewletModuleId.RunningExtensions
  }
  if (uri.startsWith('search-editor://')) {
    return ViewletModuleId.Search
  }
  if (uri.startsWith('simple-browser://')) {
    return ViewletModuleId.SimpleBrowser
  }
  if (uri.startsWith('storage-overview://')) {
    return ViewletModuleId.Storage
  }
  if (uri.startsWith('iframe-inspector://')) {
    return ViewletModuleId.IframeInspector
  }
  if (uri.startsWith('diff://')) {
    return ViewletModuleId.DiffEditor
  }
  if (uri.startsWith('inline-diff://')) {
    return ViewletModuleId.DiffEditor
  }
  if (uri.startsWith('browser-view-overview://')) {
    return ViewletModuleId.BrowserViewOverview
  }
  if (uri.startsWith('screen-cast://')) {
    return ViewletModuleId.ScreenCapture
  }
  if (uri.startsWith('e2e-test://')) {
    return ViewletModuleId.E2eTest
  }
  if (uri.startsWith('webview://')) {
    return ViewletModuleId.WebView
  }
  if (uri.startsWith('iframe-inspector://')) {
    return ViewletModuleId.IframeInspector
  }
  const openerModuleId = await getModuleIdForOpener(opener)
  if (openerModuleId) {
    return openerModuleId
  }
  if (uri.endsWith('.css') || uri.endsWith('.json') || uri.endsWith('.js') || uri.endsWith('.ts')) {
    return ViewletModuleId.EditorText
  }

  const extensionViews = await GetExtensionViews.getExtensionViews()
  if (GetExtensionViews.findExtensionView(extensionViews, uri)) {
    return ViewletModuleId.ExtensionView
  }

  // TODO only request webviews once
  const webViews = await GetWebViews.getWebViews()
  for (const webView of webViews) {
    for (const selector of webView.selector || []) {
      if (uri.endsWith(selector)) {
        // TODO configure webviews so that some open by default (video, image)
        // while other webviews only open when needed (markdown, html preview)
        if (selector === '.md') {
          continue
        }
        return ViewletModuleId.WebView
      }
    }
  }
  const fileExtension = Path.fileExtension(uri)
  const type = mapExtToEditorType[fileExtension]
  if (type) {
    return type
  }
  return ViewletModuleId.EditorText
}
