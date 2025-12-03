import { stat } from 'node:fs/promises'
import * as GetEtag from '../GetEtag/GetEtag.js'

export const getPathEtag = async (absolutePath) => {
  let stats = await stat(absolutePath)
  if (stats.isDirectory()) {
    absolutePath += '/index.html'
    stats = await stat(absolutePath)
  }
  const etag = GetEtag.getEtag(stats)
  return { etag, stats }
}
