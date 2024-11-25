import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const getKeyBindings = () => {
  return KeyBindingsViewWorker.invoke('KeyBindings.getKeyBindings')
}
