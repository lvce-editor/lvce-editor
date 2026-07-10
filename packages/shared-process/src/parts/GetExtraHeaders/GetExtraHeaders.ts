import { join } from 'path'
import { pathToFileURL } from 'url'
import * as StaticServerPath from '../StaticServerPath/StaticServerPath.ts'

export const getExtraHeaders = async ({ absolutePath, etag, isForElectronProduction, pathName }: any): Promise<any> => {
  const getHeadersPath = join(StaticServerPath.staticServerPath, 'src', 'parts', 'GetHeaders', 'GetHeaders.js')
  const getHeadersUri = pathToFileURL(getHeadersPath).toString()
  const getHeadersModule = await import(getHeadersUri)
  const getHeadersFn = getHeadersModule.getHeaders
  const isImmutable = false
  const headers = getHeadersFn({
    absolutePath,
    etag,
    isForElectronProduction,
    isImmutable,
  })
  return headers
}
