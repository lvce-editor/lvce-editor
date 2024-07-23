import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'

export const getHover = async (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  // TODO invoke extension host worker directly
  const hover = await ExtensionHostHover.executeHoverProvider(editor, offset)
  return hover
}
