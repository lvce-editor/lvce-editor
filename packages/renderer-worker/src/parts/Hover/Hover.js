import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostHover from '../ExtensionHost/ExtensionHostHover.js'

export const getHover = async (editor, offset) => {
  Assert.object(editor)
  Assert.number(offset)
  const hover = await ExtensionHostHover.executeHoverProvider(editor, offset)
  return hover
}
