import * as Path from '../Path/Path.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

const mapExtToEditorType = {
  '.png': ViewletModuleId.EditorImage,
  '.DirIcon': ViewletModuleId.EditorImage,
  '.svg': ViewletModuleId.EditorImage,
  '.avif': ViewletModuleId.EditorImage,
  '.gif': ViewletModuleId.EditorImage,
  '.ico': ViewletModuleId.EditorImage,
  '.webp': ViewletModuleId.EditorImage,
  '.jpg': ViewletModuleId.EditorImage,
  '.jpeg': ViewletModuleId.EditorImage,
  // @ts-ignore
  '.pdf': ViewletModuleId.Pdf,
  '.mp3': ViewletModuleId.Audio,
  '.mp4': ViewletModuleId.Video,
  '.mkv': ViewletModuleId.Video,
  '.webm': ViewletModuleId.Video,
  '.ogg': ViewletModuleId.Audio,
  '.opus': ViewletModuleId.Audio,
}

export const getModuleId = async (uri) => {
  if (uri === 'app://keybindings') {
    return ViewletModuleId.KeyBindings
  }
  if (uri.startsWith('extension-detail://')) {
    return ViewletModuleId.ExtensionDetail
  }
  if (uri.startsWith('simple-browser://')) {
    return ViewletModuleId.SimpleBrowser
  }
  if (uri.startsWith('storage-overview://')) {
    return ViewletModuleId.Storage
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
  if (uri.endsWith('.css') || uri.endsWith('.json') || uri.endsWith('.js') || uri.endsWith('.ts')) {
    return ViewletModuleId.EditorText
  }

  // TODO only request webviews once
  const webViews = await GetWebViews.getWebViews()
  for (const webView of webViews) {
    for (const selector of webView.selectors || []) {
      if (uri.endsWith(selector)) {
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
