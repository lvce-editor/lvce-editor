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
    case Key.KeyJ:
      return KeyCode.KeyJ
    case Key.KeyK:
      return KeyCode.KeyK
    case Key.KeyL:
      return KeyCode.KeyL
    case Key.KeyM:
      return KeyCode.KeyM
    case Key.KeyN:
      return KeyCode.KeyN
    case Key.KeyO:
      return KeyCode.KeyO
    case Key.KeyP:
      return KeyCode.KeyP
    case Key.KeyQ:
      return KeyCode.KeyQ
    case Key.KeyR:
      return KeyCode.KeyR
    case Key.KeyS:
      return KeyCode.KeyS
    case Key.KeyT:
      return KeyCode.KeyT
    case Key.KeyU:
      return KeyCode.KeyU
    case Key.KeyV:
      return KeyCode.KeyV
    case Key.KeyW:
      return KeyCode.KeyW
    case Key.KeyX:
      return KeyCode.KeyX
    case Key.KeyY:
      return KeyCode.KeyY
    case Key.KeyZ:
      return KeyCode.KeyZ
    default:
      return KeyCode.Unknown
  }
}
