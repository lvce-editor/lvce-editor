import got from 'got'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createBrotliDecompress } from 'node:zlib'
import tar from 'tar-fs'
import VError from 'verror'
import * as Path from '../Path/Path.js'

const download = async (url, outFile) => {
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
    const baseName = Path.baseName(extension.path)
    const cachedPath = Path.absolute(
      Path.join('build', '.tmp', `cachedExtensions`, baseName)
    )
    if (existsSync(cachedPath)) {
      return
    }
    await download(extension.path, cachedPath)
    await extract(
      cachedPath,
      Path.absolute(Path.join(`extensions`, extension.name))
    )
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download extension ${extension.name}`)
  }
}

export const extract = async (inFile, outDir) => {
  await mkdir(outDir, { recursive: true })
  await pipeline(
    createReadStream(inFile),
    createBrotliDecompress(),
    tar.extract(outDir)
  )
}

const downloadExtensions = async (extensions) => {
  for (const extension of extensions) {
    console.time(`[download] ${extension.name}`)
    await downloadExtension(extension)
    console.timeEnd(`[download] ${extension.name}`)
  }
}

const main = () => {
  const extensions = [
    {
      name: 'builtin.prettier',
      path: 'https://github.com/lvce-editor/prettier/releases/download/v0.0.2/prettier-v0.0.2.tar.br',
    },
    {
      name: 'builtin.language-features-typescript',
      path: 'https://github.com/lvce-editor/language-features-typescript/releases/download/v0.0.1/language-features-typescript-v0.0.1.tar.br',
    },
    {
      name: 'builtin.language-features-css',
      path: 'https://github.com/lvce-editor/language-features-css/releases/download/v0.0.2/language-features-css-v0.0.2.tar.br',
    },
    {
      name: 'builtin.language-basics-javascript',
      path: 'https://github.com/lvce-editor/language-basics-javascript/releases/download/v0.0.1/language-basics-javascript-v0.0.1.tar.br',
    },
    {
      name: 'builtin.language-basics-html',
      path: 'https://github.com/lvce-editor/language-basics-html/releases/download/v0.0.1/language-basics-html-v0.0.1.tar.br',
    },
    {
      name: 'builtin.language-basics-css',
      path: 'https://github.com/lvce-editor/language-basics-css/releases/download/v0.0.2/language-basics-css-v0.0.2.tar.br',
    },
  ]
  downloadExtensions(extensions)
}

main()
