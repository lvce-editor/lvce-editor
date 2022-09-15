export const getFilteredKeyBindings = (keyBindings, value) => {
  const filteredKeyBindings = []
  for (const keyBinding of keyBindings) {
    if (keyBinding.command.includes(value) || keyBinding.key.includes(value)) {
      filteredKeyBindings.push(keyBinding)
    }
  }
  return filteredKeyBindings
}
