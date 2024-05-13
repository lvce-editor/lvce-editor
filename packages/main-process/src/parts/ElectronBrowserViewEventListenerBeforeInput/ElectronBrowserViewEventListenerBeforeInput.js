import * as ElectronInputType from '../ElectronInputType/ElectronInputType.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.js'

export const key = 'before-input'

export const attach = (webContents, listener) => {
  webContents.on(ElectronWebContentsEventType.BeforeInputEvent, listener)
}

export const detach = (webContents, listener) => {
  webContents.off(ElectronWebContentsEventType.BeforeInputEvent, listener)
}

export const handler = (event, input) => {
  if (input.type !== ElectronInputType.KeyDown) {
    return {
      result: undefined,
      messages: [],
    }
  }
  const falltroughKeyBindings = ElectronWebContentsViewState.getFallthroughKeyBindings()
  const identifier = GetKeyBindingIdentifier.getKeyBindingIdentifier(input)
  const matches = falltroughKeyBindings.includes(identifier)
  console.log({ identifier, matches })
  if (matches) {
    event.preventDefault()
    return {
      result: undefined,
      messages: [['handleKeyBinding', identifier]],
    }
  }
  return {
    result: undefined,
    messages: [],
  }
}
