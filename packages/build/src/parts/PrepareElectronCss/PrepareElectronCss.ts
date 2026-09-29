import { readFile, writeFile } from 'node:fs/promises'
import * as Path from '../Path/Path.ts'
import * as RewriteCssAssetUrls from '../RewriteCssAssetUrls/RewriteCssAssetUrls.ts'

const rewriteProcessExplorerCss = async ({ resourcesPath, commitHash }): Promise<void> => {
  const path = Path.join(resourcesPath, 'app', 'packages', 'main-process', 'pages', 'process-explorer', 'process-explorer.css')
  const content = await readFile(path, 'utf8')
  const newContent = content.replaceAll('../../../../static/icons/', `../../../../static/${commitHash}/icons/`)
  if (newContent !== content) {
    await writeFile(path, newContent)
  }
}

export const prepareElectronCss = async ({ resourcesPath, commitHash }): Promise<void> => {
  const extensionsPath = Path.join(resourcesPath, 'app', 'static', commitHash, 'extensions')
  await RewriteCssAssetUrls.rewriteCssAssetUrlsInDirectory(extensionsPath, `/${commitHash}`)
  await rewriteProcessExplorerCss({ resourcesPath, commitHash })
}
