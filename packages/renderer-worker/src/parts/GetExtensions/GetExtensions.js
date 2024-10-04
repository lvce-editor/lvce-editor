import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'

let cache = Object.create(null)

const id = 1

export const getExtensions = () => {
  if (!cache[id]) {
    cache[id] = ExtensionMeta.getExtensions()
  }
  return cache[id]
}
