import { pathToFileURL } from 'node:url'

export const getRemoteUrl = (path: any): any => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}
