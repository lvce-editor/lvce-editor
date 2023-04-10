import * as ExtensionHostHover from '../ExtensionHost/ExtensionHostHover.js'

export const getHover = async (editor, offset) => {
  const hover = await ExtensionHostHover.executeHoverProvider(editor, offset)
  return hover
}
