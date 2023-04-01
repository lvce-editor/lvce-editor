const { default: got, RequestError } = require('got')
const { createWriteStream } = require('node:fs')
const { mkdir, rm } = require('node:fs/promises')
const { pipeline } = require('node:stream/promises')
const Path = require('node:path')
const VError = require('verror')

exports.download = async (url, outFile) => {
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile)
    } catch {
      // ignore
    }
    if (error instanceof RequestError) {
      throw new VError(`Failed to download "${url}": ${error.message}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to download "${url}"`)
  }
}
