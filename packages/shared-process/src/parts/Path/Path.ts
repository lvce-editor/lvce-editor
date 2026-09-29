import * as NodePath from 'node:path'

export const join = (...parts: any): any => {
  return NodePath.join(...parts)
}

export const dirname = (path: any): any => {
  return NodePath.dirname(path)
}

export const basename = (path: any): any => {
  return NodePath.basename(path)
}

export const resolve = (path: any): any => {
  return NodePath.resolve(path)
}

export const isAbsolute = (path: any): any => {
  return NodePath.isAbsolute(path)
}
