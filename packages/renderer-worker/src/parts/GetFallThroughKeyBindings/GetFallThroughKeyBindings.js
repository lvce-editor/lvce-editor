import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as Arrays from '../Arrays/Arrays.js'

const isFallThroughKeyBinding = (keyBinding) => {
  return !keyBinding.when || keyBinding.when == WhenExpression.BrowserElectron
}

const getKey = (keyBinding) => {
  return keyBinding.key
}

const compareNumber = (a, b) => {
  return a - b
}

export const getFallThroughKeyBindings = (keyBindings) => {
  const fallThroughKeyBindings = keyBindings.filter(isFallThroughKeyBinding)
  const keys = fallThroughKeyBindings.map(getKey)
  const sortedKeys = Arrays.toSorted(keys, compareNumber)
  return sortedKeys
}
