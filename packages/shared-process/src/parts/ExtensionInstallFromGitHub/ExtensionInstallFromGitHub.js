import { readFile, rename, rm } from 'fs/promises'
import { join } from 'path'
import VError from 'verror'
import * as DownloadAndExtract from '../DownloadAndExtract/DownloadAndExtract.js'
import * as Platform from '../Platform/Platform.js'
import * as TmpFile from '../TmpFile/TmpFile.js'

export const install = async ({ user, repo, branch, outDir = '/tmp' }) => {
  try {
    const url = `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`
    const tmpDir = await TmpFile.getTmpDir()
    await DownloadAndExtract.downloadAndExtractTarGz({
      url,
      outDir: tmpDir,
      strip: 1,
    })
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
