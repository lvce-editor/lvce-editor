import { existsSync } from 'node:fs'
import * as Path from '../Path/Path.ts'
import * as ReadFile from '../ReadFile/ReadFile.ts'
import * as Remove from '../Remove/Remove.ts'
import * as WriteFile from '../WriteFile/WriteFile.ts'

const legacyDownloadRipGrepExport = `export { downloadRipGrep } from './downloadRipGrep.js'`

const removeLegacyDownloadRipGrepExport = async (indexJsPath) => {
  const content = await ReadFile.readFile(indexJsPath)
  if (!content.includes(legacyDownloadRipGrepExport)) {
    return
  }
  const newContent = content.replaceAll(legacyDownloadRipGrepExport, '')
  await WriteFile.writeFile({
    to: indexJsPath,
    content: newContent,
  })
}

export const removeRipGrepFiles = async (to, platform, arch) => {
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/index.d.ts`))
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/postinstall.js`))
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/downloadRipGrep.js`))
  const indexJsPath = Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/index.js`)
  if (!existsSync(indexJsPath)) {
    throw new Error(`ripgrep indexjs not found at: ${indexJsPath}`)
  }
  await removeLegacyDownloadRipGrepExport(indexJsPath)
}
