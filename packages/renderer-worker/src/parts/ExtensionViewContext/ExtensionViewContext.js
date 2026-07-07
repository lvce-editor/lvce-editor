import * as Context from '../Context/Context.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'

const contexts = Object.create(null)

const getAllKeys = () => {
  const keys = new Set()
  for (const context of Object.values(contexts)) {
    for (const key of Object.keys(context)) {
      keys.add(key)
    }
  }
  return keys
}

const removeKeys = (keys) => {
  for (const key of keys) {
    Context.remove(key)
  }
}

const addAllContexts = () => {
  for (const context of Object.values(contexts)) {
    for (const [key, value] of Object.entries(context)) {
      if (value === true) {
        Context.set(key, true)
      }
    }
  }
}

export const handleViewContextChange = (uid, viewId, context) => {
  const oldKeys = getAllKeys()
  removeKeys(oldKeys)
  if (!context || Object.keys(context).length === 0) {
    delete contexts[uid]
  } else {
    contexts[uid] = context
  }
  addAllContexts()
  KeyBindingsState.update()
}
