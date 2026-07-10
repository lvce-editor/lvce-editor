import { extname } from 'path'
import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetExtraHeaders from '../GetExtraHeaders/GetExtraHeaders.ts'
import * as GetMimeType from '../GetMimeType/GetMimeType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeaders = async (absolutePath: any, pathName: any, etag: any, url: any, size: any): Promise<any> => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers: Record<string, any> = {
    [HttpHeader.ContentLength]: `${size}`,
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
  }
  const extraHeaders = await GetExtraHeaders.getExtraHeaders({
    absolutePath,
    etag,
    isForElectronProduction: false,
    pathName,
  })
  const dynamicCsp = ContentSecurityPolicyState.get(url)
  if (dynamicCsp) {
    headers[HttpHeader.ContentSecurityPolicy] = dynamicCsp
  }
  if (etag) {
    headers[HttpHeader.Etag] = etag
  }
  return {
    ...headers,
    ...extraHeaders,
  }
}
