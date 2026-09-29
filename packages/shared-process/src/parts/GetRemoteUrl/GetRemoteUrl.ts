import { pathToFileURL } from 'node:url'

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice('file://'.length)
  return `/remote${url}`
}
