import * as Path from '../Path/Path.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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
  '.pdf': ViewletModuleId.Pdf,
  '.mp3': ViewletModuleId.Audio,
  '.mp4': ViewletModuleId.Video,
  '.mkv': ViewletModuleId.Video,
  '.webm': ViewletModuleId.Video,
  '.ogg': ViewletModuleId.Audio,
  '.opus': ViewletModuleId.Audio,
}

export const getModuleId = (uri) => {
  const fileExtension = Path.fileExtension(uri)
  const type = mapExtToEditorType[fileExtension]
  if (type) {
    return type
  }
  if (uri === 'app://keybindings') {
    return ViewletModuleId.KeyBindings
  }
  if (uri.startsWith('extension-detail://')) {
    return ViewletModuleId.ExtensionDetail
  }
  if (uri.startsWith('simple-browser://')) {
    return ViewletModuleId.SimpleBrowser
  }
  if (uri.startsWith('diff://')) {
    return ViewletModuleId.DiffEditor
  }
  if (uri.startsWith('browser-view-overview://')) {
    return ViewletModuleId.BrowserViewOverview
  }
  if (uri.startsWith('screen-cast://')) {
    return ViewletModuleId.ScreenCapture
  }
  return ViewletModuleId.EditorText
}
