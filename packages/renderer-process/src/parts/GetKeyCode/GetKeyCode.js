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
    case Key.KeyF:
      return KeyCode.KeyF
    case Key.KeyG:
      return KeyCode.KeyG
    case Key.KeyH:
      return KeyCode.KeyH
    case Key.KeyI:
      return KeyCode.KeyI
    default:
      return KeyCode.Unknown
  }
}
