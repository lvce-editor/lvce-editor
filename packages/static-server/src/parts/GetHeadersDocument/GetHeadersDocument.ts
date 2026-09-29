import * as CachingHeaders from '../CachingHeaders/CachingHeaders.ts'
import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

interface GetHeadersDocumentOptions {
  readonly applicationName?: string
  readonly etag: string
  readonly isForElectronProduction: boolean
  readonly mime: string
}

export const getHeadersDocument = ({
  mime,
  etag,
  isForElectronProduction,
  applicationName = 'lvce-oss',
}: GetHeadersDocumentOptions): Record<string, string> => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.getValue({ isForElectronProduction, applicationName }),
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
