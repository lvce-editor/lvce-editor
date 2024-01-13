const matchesArgs = (a, b) => {
  console.log({ a, b })
  if (!a && !b) {
    return true
  }
  if ((!a && b) || (!b && a)) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export const getCommandKeyBinding = (keyBindings, command, args) => {
  for (const keyBinding of keyBindings) {
    if (keyBinding.command === command && matchesArgs(keyBinding.args, args)) {
      return keyBinding
    }
  }
  return undefined
}
