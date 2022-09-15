export const getId = (uri) => {
  if (uri.endsWith('.png')) {
    return 'EditorImage'
  }
  if (uri === 'app://keybindings') {
    return 'KeyBindings'
  }
  return 'EditorText'
}
