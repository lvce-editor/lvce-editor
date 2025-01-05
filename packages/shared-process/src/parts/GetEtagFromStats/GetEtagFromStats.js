import { createHash } from 'node:crypto'

export const getEtagFromStats = (stats) => {
  const hash = createHash('sha1')
  for (const stat of stats) {
    hash.update(`${stat.mtime}`)
    hash.update(`${stat.size}`)
  }
  const finalHash = hash.digest('hex')
  return finalHash
}
