import { join } from 'path'
import { pathToFileURL } from 'url'
import * as StaticServerPath from '../StaticServerPath/StaticServerPath.js'

export const getExtraHeaders = async ({ absolutePath, pathName, etag, isForElectronProduction }) => {
  const getHeadersPath = join(StaticServerPath.staticServerPath, 'src', 'parts', 'GetHeaders', 'GetHeaders.js')
  const getHeadersUri = pathToFileURL(getHeadersPath).toString()
  const getHeadersModule = await import(getHeadersUri)
  const getHeadersFn = getHeadersModule.getHeaders
  const isImmutable = false
  const headers = getHeadersFn({
    absolutePath,
    etag,
    isImmutable,
    isForElectronProduction,
  })
  return headers
}
