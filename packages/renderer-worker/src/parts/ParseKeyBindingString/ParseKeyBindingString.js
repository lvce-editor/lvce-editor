import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

const keyAliases = {
  '`': KeyCode.Backquote,
  ',': KeyCode.Comma,
  '-': KeyCode.Minus,
  '=': KeyCode.Equal,
  '+': KeyCode.Plus,
  '*': KeyCode.Star,
  '\\': KeyCode.Backslash,
  backquote: KeyCode.Backquote,
  backslash: KeyCode.Backslash,
  comma: KeyCode.Comma,
  delete: KeyCode.Delete,
  down: KeyCode.DownArrow,
  downarrow: KeyCode.DownArrow,
  end: KeyCode.End,
  enter: KeyCode.Enter,
  escape: KeyCode.Escape,
  f1: KeyCode.F1,
  f2: KeyCode.F2,
  f3: KeyCode.F3,
  f4: KeyCode.F4,
  f5: KeyCode.F5,
  f6: KeyCode.F6,
  f7: KeyCode.F7,
  f8: KeyCode.F8,
  f9: KeyCode.F9,
  f10: KeyCode.F10,
  f11: KeyCode.F11,
  f12: KeyCode.F12,
  home: KeyCode.Home,
  insert: KeyCode.Insert,
  left: KeyCode.LeftArrow,
  leftarrow: KeyCode.LeftArrow,
  minus: KeyCode.Minus,
  pagedown: KeyCode.PageDown,
  pageup: KeyCode.PageUp,
  plus: KeyCode.Plus,
  right: KeyCode.RightArrow,
  rightarrow: KeyCode.RightArrow,
  space: KeyCode.Space,
  tab: KeyCode.Tab,
  up: KeyCode.UpArrow,
  uparrow: KeyCode.UpArrow,
}

const getKeyCode = (part) => {
  const normalized = part.toLowerCase()
  if (normalized.length === 1 && normalized >= 'a' && normalized <= 'z') {
    return KeyCode[`Key${normalized.toUpperCase()}`]
  }
  if (normalized.length === 1 && normalized >= '0' && normalized <= '9') {
    return KeyCode[`Digit${normalized}`]
  }
  return keyAliases[normalized] || KeyCode.Unknown
}

export const parseKeyBindingString = (keybinding) => {
  if (typeof keybinding !== 'string') {
    return KeyCode.Unknown
  }
  const parts = keybinding
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length === 0) {
    return KeyCode.Unknown
  }
  let key = KeyCode.Unknown
  let modifiers = 0
  for (const part of parts) {
    const normalized = part.toLowerCase()
    switch (normalized) {
      case 'alt':
        modifiers |= KeyModifier.Alt
        break
      case 'cmd':
      case 'command':
      case 'ctrl':
      case 'ctrlcmd':
      case 'meta':
        modifiers |= KeyModifier.CtrlCmd
        break
      case 'shift':
        modifiers |= KeyModifier.Shift
        break
      default:
        key = getKeyCode(part)
        break
    }
  }
  if (key === KeyCode.Unknown) {
    return KeyCode.Unknown
  }
  return modifiers | key
}
