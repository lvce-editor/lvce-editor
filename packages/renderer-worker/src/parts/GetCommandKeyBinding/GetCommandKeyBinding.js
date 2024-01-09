export const getCommandKeyBinding = (keyBindings, command) => {
  for (const keyBinding of keyBindings) {
    if (keyBinding.command === command) {
      return keyBinding
    }
  }
  return undefined
}
