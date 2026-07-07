import { pathToFileURL } from 'node:url'

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice('file://'.length)
  return `/remote${url}`
}
