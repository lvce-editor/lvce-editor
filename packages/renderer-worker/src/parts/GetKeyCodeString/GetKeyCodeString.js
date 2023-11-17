import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyCodeString from '../KeyCodeString/KeyCodeString.js'

export const getKeyCodeString = (keyCode) => {
  switch (keyCode) {
    case KeyCode.Backspace:
      return KeyCodeString.Backspace
    case KeyCode.Tab:
      return KeyCodeString.Tab
    case KeyCode.Enter:
      return KeyCodeString.Enter
    case KeyCode.Space:
      return KeyCodeString.Space
    case KeyCode.PageUp:
      return KeyCodeString.PageUp
    case KeyCode.PageDown:
      return KeyCodeString.PageDown
    case KeyCode.End:
      return KeyCodeString.End
    case KeyCode.Home:
      return KeyCodeString.Home
    case KeyCode.LeftArrow:
      return KeyCodeString.LeftArrow
    case KeyCode.UpArrow:
      return KeyCodeString.UpArrow
    case KeyCode.RightArrow:
      return KeyCodeString.RightArrow
    case KeyCode.DownArrow:
      return KeyCodeString.DownArrow
    case KeyCode.Insert:
      return KeyCodeString.Insert
    case KeyCode.Delete:
      return KeyCodeString.Delete
    case KeyCode.Digit0:
      return KeyCodeString.Digit0
    case KeyCode.KeyA:
      return KeyCodeString.KeyA
    case KeyCode.KeyB:
      return KeyCodeString.KeyB
    case KeyCode.KeyC:
      return KeyCodeString.KeyC
    case KeyCode.KeyD:
      return KeyCodeString.KeyD
    case KeyCode.KeyE:
      return KeyCodeString.KeyE
    case KeyCode.KeyF:
      return KeyCodeString.KeyF
    case KeyCode.KeyG:
      return KeyCodeString.KeyG
    case KeyCode.KeyH:
      return KeyCodeString.KeyH
    case KeyCode.KeyI:
      return KeyCodeString.KeyI
    default:
      return KeyCodeString.Unknown
  }
}
