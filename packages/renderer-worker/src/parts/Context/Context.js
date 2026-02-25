import * as WhenExpression from '../WhenExpression/WhenExpression.js'

let contexts = Object.create(null)

// TODO all context keys should be numeric
// comparing numbers is faster and more efficient than comparing strings every time
// e.g. map 'focus.editor' -> 1
// e.g. map 'focus.explorer' -> 2
// Context.get(1), Context.get(2)

export const get = (key) => {
  return contexts[key]
}

export const getAll = () => {
  return contexts
}

export const reset = () => {
  const oldContexts = contexts
  contexts = Object.create(null)
  for (const key of [WhenExpression.BrowserChromium, WhenExpression.BrowserChromium, WhenExpression.BrowserFirefox]) {
    if (oldContexts[key]) {
      contexts = { ...contexts, [key]: true }
    }
  }
}

export const set = (key, value) => {
  contexts = {
    ...contexts,
    [key]: value,
  }
}

export const remove = (key) => {
  const { [key]: _, ...rest } = contexts
  contexts = rest
}
