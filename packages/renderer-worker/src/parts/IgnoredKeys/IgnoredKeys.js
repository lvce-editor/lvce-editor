const IGNORED_KEYS = [
  'Alt',
  'Shift',
  'Control',
  'Unidentified',
  'CapsLock',
  'PageUp',
  'PageDown',
  'Insert',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'ContextMenu',
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
]

export const isIgnoredKey = (key) => {
  return IGNORED_KEYS.includes(key)
}
