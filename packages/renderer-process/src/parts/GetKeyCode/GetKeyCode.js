import * as Key from '../Key/Key.js'
import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyCode = (key) => {
  switch (key) {
    case Key.KeyA:
      return KeyCode.KeyA
    case Key.KeyB:
      return KeyCode.KeyB
    case Key.KeyC:
      return KeyCode.KeyC
    case Key.KeyD:
      return KeyCode.KeyD
    case Key.KeyE:
      return KeyCode.KeyE
    default:
      return KeyCode.Unknown
  }
}
