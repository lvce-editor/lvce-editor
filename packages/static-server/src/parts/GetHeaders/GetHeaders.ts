import * as CachingHeaders from '../CachingHeaders/CachingHeaders.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.ts'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.ts'
import * as GetHeadersExtensionWorker from '../GetHeadersExtensionWorker/GetHeadersExtensionWorker.ts'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'
import * as GetMimeType from '../GetMimeType/GetMimeType.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as MimeType from '../MimeType/MimeType.ts'
import * as Path from '../Path/Path.ts'
import workers from '../../../../renderer-worker/src/parts/Workers/Workers.json' with { type: 'json' }

const workerHeaders = Object.create(null)

interface GetHeadersOptions {
  readonly absolutePath: string
  readonly applicationName?: string
  readonly etag: string
  readonly isForElectronProduction: boolean
  readonly isImmutable: boolean
}

for (const worker of workers) {
  workerHeaders[worker.fileName] = GetContentSecurityPolicy.getContentSecurityPolicy(worker.contentSecurityPolicy)
}

export const getHeaders = ({
  absolutePath,
  etag,
  isImmutable,
  isForElectronProduction,
  applicationName,
}: GetHeadersOptions): Record<string, string> => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const defaultCachingHeader = isImmutable ? CachingHeaders.OneYear : CachingHeaders.NoCache
  if (absolutePath.endsWith('index.html')) {
    return GetHeadersDocument.getHeadersDocument({ mime, etag, isForElectronProduction, applicationName })
  }
  if (mime === MimeType.FontTtf) {
    // WebKit applies worker loading checks to FontFace requests from workers.
    // Keep font responses isolated and allow worker-src 'self' in the text measurement worker's CSP.
    return {
      ...GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader),
      [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    }
  }
  const normalizedPath = absolutePath.replaceAll('\\', '/')
  const worker = workers.find((item) => {
    return normalizedPath.endsWith(item.fileName)
  })
  if (worker) {
    const csp = workerHeaders[worker.fileName]
    return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, csp)
  }
  if (absolutePath.endsWith('rendererWorkerMain.js') || absolutePath.endsWith('rendererWorkerMain.ts')) {
    return GetHeadersRendererWorker.getHeadersRendererWorker(mime, etag, defaultCachingHeader)
  }
  if (/\/packages\/renderer-worker\/(?:dist|src)\/.*\.(?:js|ts)$/.test(normalizedPath)) {
    // WebKit checks isolation headers on module imports from the renderer worker too.
    return {
      ...GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader),
      [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    }
  }
  if (absolutePath.includes('/extensions/') && (absolutePath.endsWith('.js') || absolutePath.endsWith('.ts'))) {
    return GetHeadersExtensionWorker.getHeadersExtensionWorker(mime, etag, defaultCachingHeader)
  }
  return GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader)
}
