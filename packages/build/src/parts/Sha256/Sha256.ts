import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'

export const computeFileSha256 = async (filePath: string): Promise<string> => {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk)
  }
  return hash.digest('hex')
}

export const computeUrlSha256 = async (url: string, getStream: (url: string) => NodeJS.ReadableStream): Promise<string> => {
  const hash = createHash('sha256')
  for await (const chunk of getStream(url)) {
    hash.update(chunk)
  }
  return hash.digest('hex')
}

export const isSha256 = (value: unknown): value is string => {
  return typeof value === 'string' && /^[a-f\d]{64}$/.test(value)
}
