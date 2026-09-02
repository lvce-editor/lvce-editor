import * as FileSystem from '../FileSystem/FileSystem.js'

const isValidUserKeyBinding = (keyBinding) => {
  return (
    keyBinding &&
    keyBinding.source === 'User' &&
    typeof keyBinding.command === 'string' &&
    keyBinding.command.length > 0 &&
    Number.isInteger(keyBinding.key)
  )
}

export const getKeyBindings = async () => {
  try {
    const content = await FileSystem.readFile('app://keybindings.json')
    if (typeof content !== 'string') {
      return []
    }
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isValidUserKeyBinding)
  } catch {
    return []
  }
}
