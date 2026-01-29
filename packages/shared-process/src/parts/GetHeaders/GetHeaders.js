import { extname } from 'path'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetExtraHeaders from '../GetExtraHeaders/GetExtraHeaders.js'
import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeaders = async (absolutePath, pathName, etag, url, size) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    [HttpHeader.ContentType]: mime,
    [HttpHeader.ContentLength]: `${size}`,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
  }
  const extraHeaders = await GetExtraHeaders.getExtraHeaders({
    absolutePath,
    pathName,
    etag,
    isForElectronProduction: false,
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
