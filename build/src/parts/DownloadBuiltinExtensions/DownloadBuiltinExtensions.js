import got from 'got'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import pMap from 'p-map'
import tar from 'tar-fs'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Process from '../Process/Process.js'
import * as Path from '../Path/Path.js'
import extensions from './builtinExtensions.json' assert { type: 'json' }

const downloadUrl = async (url, outFile) => {
  try {
    await mkdir(Path.dirname(outFile), { recursive: true })
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile)
    } catch {}
    // @ts-ignore
    throw new VError(error, `Failed to download "${url}"`)
  }
}

const downloadExtension = async (extension) => {
  try {
    Assert.string(extension.repository)
    Assert.string(extension.name)
    Assert.string(extension.version)
    if (!extension.repository.startsWith('github.com/')) {
      throw new VError('currenly only extensions from github releases are supported')
    }
    const baseName = Path.baseName(extension.repository)
    const cacheName = baseName + '-' + extension.version + '.tar.br'
    const cachedPath = Path.absolute(Path.join('build', '.tmp', `cachedExtensions`, cacheName))
    const outPath = Path.absolute(Path.join(`extensions`, extension.name))
    if (existsSync(cachedPath)) {
      if (!existsSync(outPath)) {
        // TODO check version of unpackaged extension and when it is different, unpack the new extension
        await extract(cachedPath, Path.absolute(Path.join(`extensions`, extension.name)))
      }
      return
    }
    const url = `https://${extension.repository}/releases/download/v${extension.version}/${baseName}-v${extension.version}.tar.br`
    await downloadUrl(url, cachedPath)
    await extract(cachedPath, outPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download extension ${extension.name}`)
  }
}

export const extract = async (inFile, outDir) => {
  try {
    await mkdir(outDir, { recursive: true })
    await pipeline(createReadStream(inFile), createBrotliDecompress(), tar.extract(outDir))
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to extract ${inFile}`)
  }
}

const downloadExtensionAndLog = async (extension) => {
  console.time(`[download] ${extension.name}`)
  await downloadExtension(extension)
  console.timeEnd(`[download] ${extension.name}`)
}

const downloadExtensions = async (extensions) => {
  await pMap(extensions, downloadExtensionAndLog, {
    concurrency: 1,
    stopOnError: false,
  })
}

const printError = (error) => {
  if (error && error.constructor.name === 'AggregateError') {
    for (const subError of error.errors) {
      if (subError.message.includes('Response code')) {
        console.error(subError.message)
      } else {
        console.error(subError)
      }
    }
  } else if (error && error instanceof Error && error.message.includes('Response code ')) {
    console.error(error.message)
  } else if (error && error instanceof Error && error.message.includes(`connect ETIMEDOUT`)) {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

const main = async () => {
  try {
    await downloadExtensions(extensions)
  } catch (error) {
    printError(error)
    Process.exit(1)
  }
}

main()
