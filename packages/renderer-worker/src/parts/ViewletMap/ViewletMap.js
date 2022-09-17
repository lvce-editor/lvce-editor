export const getId = (uri) => {
  if (uri.endsWith('.png') || uri.endsWith('.svg')) {
    return 'EditorImage'
  }
  if (uri === 'app://keybindings') {
    return 'KeyBindings'
  }
  return 'EditorText'
}
