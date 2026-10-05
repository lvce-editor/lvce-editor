import { readdir, readFile, writeFile } from 'node:fs/promises'
import * as Path from '../Path/Path.ts'

export const rewriteCssAssetUrls = (content: string, assetDir: string, iconsDir = assetDir): string => {
  return content.replaceAll(/url\((['"]?)\/icons\//g, `url($1${iconsDir}/icons/`).replaceAll(/url\((['"]?)\/fonts\//g, `url($1${assetDir}/fonts/`)
}

export const rewriteCssAssetUrlsInFile = async (path: string, assetDir: string, iconsDir = assetDir): Promise<void> => {
  const content = await readFile(path, 'utf8')
  const newContent = rewriteCssAssetUrls(content, assetDir, iconsDir)
  if (newContent !== content) {
    await writeFile(path, newContent)
  }
}

export const rewriteCssAssetUrlsInDirectory = async (path: string, assetDir: string, iconsDir = assetDir): Promise<void> => {
  const dirents = await readdir(path, { withFileTypes: true })
  for (const dirent of dirents) {
    const childPath = Path.join(path, dirent.name)
    if (dirent.isDirectory()) {
      await rewriteCssAssetUrlsInDirectory(childPath, assetDir, iconsDir)
    } else if (dirent.name.endsWith('.css')) {
      await rewriteCssAssetUrlsInFile(childPath, assetDir, iconsDir)
    }
  }
}
