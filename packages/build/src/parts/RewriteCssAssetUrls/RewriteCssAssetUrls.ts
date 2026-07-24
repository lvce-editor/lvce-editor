import { readdir, readFile, writeFile } from 'node:fs/promises'
import * as Path from '../Path/Path.ts'

export const rewriteCssAssetUrls = (content: string, assetDir: string): string => {
  return content.replaceAll(/url\((['"]?)\/icons\//g, `url($1${assetDir}/icons/`).replaceAll(/url\((['"]?)\/fonts\//g, `url($1${assetDir}/fonts/`)
}

export const rewriteCssAssetUrlsInFile = async (path: string, assetDir: string): Promise<void> => {
  const content = await readFile(path, 'utf8')
  const newContent = rewriteCssAssetUrls(content, assetDir)
  if (newContent !== content) {
    await writeFile(path, newContent)
  }
}

export const rewriteCssAssetUrlsInDirectory = async (path: string, assetDir: string): Promise<void> => {
  const dirents = await readdir(path, { withFileTypes: true })
  for (const dirent of dirents) {
    const childPath = Path.join(path, dirent.name)
    if (dirent.isDirectory()) {
      await rewriteCssAssetUrlsInDirectory(childPath, assetDir)
    } else if (dirent.name.endsWith('.css')) {
      await rewriteCssAssetUrlsInFile(childPath, assetDir)
    }
  }
}
