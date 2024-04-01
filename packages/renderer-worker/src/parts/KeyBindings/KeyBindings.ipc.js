import * as KeyBindings from './KeyBindings.js'

export const name = 'KeyBindings'

export const Commands = {
  handleKeyBinding: KeyBindings.handleKeyBinding,
  // @ts-ignore
  setIdentifiers: KeyBindings.setIdentifiers,
  // @ts-ignore
  hydrate: KeyBindings.hydrate,
}
