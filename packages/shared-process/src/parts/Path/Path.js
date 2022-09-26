import * as NodePath from 'node:path'

export const getHomeDir = () => {}

export const getTmpDir = () => {}

export const getBuiltinExtensionDir = () => {}

export const getMarketplaceExtensionDir = () => {}

export const join = (...parts) => {
  return NodePath.join(...parts)
}

export const dirname = (path) => {
  return NodePath.dirname(path)
}

export const basename = (path) => {
  return NodePath.basename(path)
}

export const resolve = (path) => {
  return NodePath.resolve(path)
}

export const isAbsolute = (path) => {
  return NodePath.isAbsolute(path)
}
