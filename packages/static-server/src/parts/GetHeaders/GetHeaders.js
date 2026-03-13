import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as Path from '../Path/Path.js'
import workers from '../../../../renderer-worker/src/parts/Workers/Workers.json' with { type: 'json' }

const workerHeaders = new Map(
  workers.map((worker) => {
    return [worker.fileName, GetContentSecurityPolicy.getContentSecurityPolicy(worker.contentSecurityPolicy)]
  }),
)

export const getHeaders = ({ absolutePath, etag, isImmutable, isForElectronProduction, applicationName }) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const defaultCachingHeader = isImmutable ? CachingHeaders.OneYear : CachingHeaders.NoCache
  if (absolutePath.endsWith('index.html')) {
    return GetHeadersDocument.getHeadersDocument({ mime, etag, isForElectronProduction, applicationName })
  }
  const worker = workers.find((item) => {
    return absolutePath.endsWith(item.fileName)
  })
  if (worker) {
    const csp = workerHeaders.get(worker.fileName)
    return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, csp)
  }
  if (absolutePath.endsWith('rendererWorkerMain.js') || absolutePath.endsWith('rendererWorkerMain.ts')) {
    return GetHeadersRendererWorker.getHeadersRendererWorker(mime, etag, defaultCachingHeader)
  }
  return GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader)
}
