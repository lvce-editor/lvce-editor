import * as WhenExpression from '../WhenExpression/WhenExpression.js'

const isFallThroughKeyBinding = (keyBinding) => {
  return !keyBinding.when || keyBinding.when == WhenExpression.BrowserElectron
}

const getKey = (keyBinding) => {
  return keyBinding.key
}

export const getFallThroughKeyBindings = (keyBindings) => {
  const fallThroughKeyBindings = keyBindings.filter(isFallThroughKeyBinding)
  const keys = fallThroughKeyBindings.map(getKey)
  return keys
}
