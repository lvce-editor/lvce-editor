import * as ParseKeyBinding from '../ParseKeyBinding/ParseKeyBinding.js'

export const parseKeyBindings = (keyBindings) => {
  return keyBindings.map(ParseKeyBinding.parseKeyBinding)
}
