import got from 'got'
import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
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
    await download(
      extension.path,
      Path.absolute(Path.join('extensions', `${extension.name}.tar.br`))
    )
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download extension ${extension.name}`)
  }
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
  ]
  downloadExtensions(extensions)
}

main()
