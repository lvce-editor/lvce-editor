import { extname } from 'path'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetExtraHeaders from '../GetExtraHeaders/GetExtraHeaders.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeaders = async (absolutePath, pathName) => {
  const extension = extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const headers = {
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
  }
  const extraHeaders = GetExtraHeaders.getExtraHeaders(pathName, extension)
  return {
    ...headers,
    ...extraHeaders,
  }
}
