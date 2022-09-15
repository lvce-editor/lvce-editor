const parseKey = (rawKey) => {
  const parts = rawKey.split('+')
  let isCtrl = false
  let isShift = false
  let key = ''
  for (const part of parts) {
    switch (part) {
      case 'shift':
        isShift = true
        break
      case 'ctrl':
        isCtrl = true
      default:
        key = part
        break
    }
  }
  return {
    key,
    isCtrl,
    isShift,
  }
}

const parseKeyBinding = (keyBinding) => {
  return {
    ...keyBinding,
    rawKey: keyBinding.key,
    ...parseKey(keyBinding.key),
  }
}

export const parseKeyBindings = (keyBindings) => {
  return keyBindings.map(parseKeyBinding)
}
