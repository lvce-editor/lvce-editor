import { Buffer } from 'node:buffer'
import * as Path from '../Path/Path.ts'

export const getNativeDependencyCachePath = (root: string, hash: string): string => {
  // Preserve the entire digest while leaving room for MSBuild's generated filenames.
  const cacheKey = Buffer.from(hash, 'hex').toString('base64url')
  return Path.join(root, '.tmp/native', cacheKey)
}
