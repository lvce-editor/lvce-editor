import { net } from 'electron'
import { pathToFileURL } from 'node:url'
import * as Babel from '../Babel/Babel.js'
import * as GetTypeScriptCachePath from '../GetTypeScriptCachePath/GetTypescriptCachePath.js'

export const getFileResponseTypeScript = async (path) => {
  const from = path
  const to = await GetTypeScriptCachePath.getTypeScriptCachePath(path)
  await Babel.transpile(from, to)
  const url = pathToFileURL(to)
  const response = await net.fetch(url)
  return response
}
