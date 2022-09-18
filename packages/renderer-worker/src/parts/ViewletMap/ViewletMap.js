import * as Path from '../Path/Path.js'

const mapExtToEditorType = {
  '.png': 'EditorImage',
  '.svg': 'EditorImage',
  '.avif': 'EditorImage',
  '.gif': 'EditorImage',
  '.ico': 'EditorImage',
  '.webp': 'EditorImage',
  '.jpg': 'EditorImage',
  '.jpeg': 'EditorImage',
}

export const getId = (uri) => {
  const fileExtension = Path.fileExtension(uri)
  const type = mapExtToEditorType[fileExtension]
  if (type) {
    return type
  }
  if (uri === 'app://keybindings') {
    return 'KeyBindings'
  }
  return 'EditorText'
}
