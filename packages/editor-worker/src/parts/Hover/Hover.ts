import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const getHover = async (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  // TODO invoke extension host worker directly
  const hover = await ExtensionHostWorker.invoke(ExtensionHostCommandType.HoverExecute, editor.uid, offset)
  return hover
}
