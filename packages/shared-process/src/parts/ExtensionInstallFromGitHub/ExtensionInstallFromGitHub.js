import { readFile, rm, rename } from 'fs/promises'
import got from 'got'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import tar from 'tar-fs'
import VError from 'verror'
import { createGunzip } from 'zlib'
import * as TmpFile from '../TmpFile/TmpFile.js'
import * as Platform from '../Platform/Platform.js'

export const install = async ({ user, repo, branch, outDir = '/tmp' }) => {
  try {
    const tmpDir = await TmpFile.getTmpDir()
    await pipeline(
      got.stream(
        `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`
      ),
      createGunzip(),
      tar.extract(tmpDir, {
        strip: 1,
      })
    )
    const extensionsPath = Platform.getExtensionsPath()
    const manifestPath = join(tmpDir, 'extension.json')
    const manifestContent = await readFile(manifestPath, 'utf8')
    const manifestJson = JSON.parse(manifestContent)
    const id = manifestJson.id
    if (!id) {
      throw new Error('missing id in extension manifest')
    }
    const outDir = join(extensionsPath, id)
    await rm(outDir, { recursive: true, force: true })
    await rename(tmpDir, outDir)
  } catch (error) {
    throw new VError(error, `Failed to install ${user}/${repo}`)
  }
}
