import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results: any) => {
  return results[0]
}

export const executeHoverProvider = (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  // @ts-ignore
  return ExtensionHostEditor.execute({
    event: ExtensionHostActivationEvent.OnHover,
    editor,
    method: ExtensionHostCommandType.HoverExecute,
    args: [offset],
    noProviderFoundMessage: 'No hover provider found',
    combineResults,
  })
}