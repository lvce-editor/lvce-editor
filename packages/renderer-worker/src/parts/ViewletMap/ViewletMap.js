import * as Path from '../Path/Path.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const mapExtToEditorType = {
  '.png': ViewletModuleId.EditorImage,
  '.svg': ViewletModuleId.EditorImage,
  '.avif': ViewletModuleId.EditorImage,
  '.gif': ViewletModuleId.EditorImage,
  '.ico': ViewletModuleId.EditorImage,
  '.webp': ViewletModuleId.EditorImage,
  '.jpg': ViewletModuleId.EditorImage,
  '.jpeg': ViewletModuleId.EditorImage,
  '.pdf': ViewletModuleId.Pdf,
}

export const getId = (uri) => {
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
  return ViewletModuleId.EditorText
}
