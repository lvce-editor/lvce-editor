import * as KeyBindings from './KeyBindings.js'

export const name = 'KeyBindings'

export const Commands = {
  // Command.register(756, KeyBindings.setKeyBindings)
  hydrate: KeyBindings.hydrate,
}
