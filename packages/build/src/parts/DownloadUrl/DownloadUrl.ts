import got from 'got'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { dirname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { VError } from '@lvce-editor/verror'

const DOWNLOAD_RETRY_LIMIT = 2
const DOWNLOAD_RETRY_DELAY_MS = 1000

const TRANSIENT_HTTP_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504, 521, 522, 524])
const TRANSIENT_NETWORK_ERROR_CODES = new Set([
  'EADDRINUSE',
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'ENETUNREACH',
  'ENOTFOUND',
  'EPIPE',
  'ETIMEDOUT',
])

const wait = async (milliseconds) => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export const isRetryableDownloadError = (error) => {
  if (!error) {
    return false
  }
  if (TRANSIENT_HTTP_STATUS_CODES.has(error.response?.statusCode)) {
    return true
  }
  return TRANSIENT_NETWORK_ERROR_CODES.has(error.code)
}

const downloadOnce = async (url, outFile) => {
  // Disable Got's stream retries so each attempt owns a fresh request and output stream.
  await pipeline(got.stream(url, { retry: { limit: 0 } }), createWriteStream(outFile))
}

export const downloadUrl = async (url, outFile, options: { retryLimit?: number; retryDelayMs?: number } = {}) => {
  const retryLimit = options.retryLimit ?? DOWNLOAD_RETRY_LIMIT
  const retryDelayMs = options.retryDelayMs ?? DOWNLOAD_RETRY_DELAY_MS
  try {
    await mkdir(dirname(outFile), { recursive: true })
    for (let attempt = 0; attempt <= retryLimit; attempt++) {
      try {
        await downloadOnce(url, outFile)
        return
      } catch (error) {
        await rm(outFile, { force: true })
        if (!isRetryableDownloadError(error) || attempt === retryLimit) {
          throw error
        }
        await wait(retryDelayMs * 2 ** attempt)
      }
    }
  } catch (error) {
    try {
      await rm(outFile, { force: true })
    } catch {}
    throw new VError(error, `Failed to download "${url}"`)
  }
}
