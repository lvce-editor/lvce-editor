import * as Path from '../Path/Path.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

// TODO move this all to extensions

const mapExtToEditorType = {
  '.mp3': ViewletModuleId.Audio,
  '.mp4': ViewletModuleId.Video,
  '.mkv': ViewletModuleId.Video,
  '.webm': ViewletModuleId.Video,
  '.ogg': ViewletModuleId.Audio,
  '.opus': ViewletModuleId.Audio,
}

export const getModuleId = async (uri, opener) => {
  // TODO rename scheme to keybindings://
  if (uri === 'app://keybindings') {
    return ViewletModuleId.KeyBindings
  }
  if (uri.startsWith('extension-detail://')) {
    return ViewletModuleId.ExtensionDetail
  }
  if (uri.startsWith('language-models://')) {
    return ViewletModuleId.LanguageModels
  }
  if (uri.startsWith('settings://')) {
    return ViewletModuleId.Settings
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
    return ViewletModuleId.InlineDiffEditor
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
  if (uri.endsWith('.css') || uri.endsWith('.json') || uri.endsWith('.js') || uri.endsWith('.ts')) {
    return ViewletModuleId.EditorText
  }

  // TODO only request webviews once
  const webViews = await GetWebViews.getWebViews()
  for (const webView of webViews) {
    if (webView && webView.id === opener) {
      // TODO can return webview directly here?
      return ViewletModuleId.WebView
    }
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
