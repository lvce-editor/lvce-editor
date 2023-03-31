import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Copy from '../Copy/Copy.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'
import * as Root from '../Root/Root.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const getParts = (appCss) => {
  const lines = SplitLines.splitLines(appCss)
  const parts = []
  for (const line of lines) {
    if (line.startsWith(`@import './parts/`)) {
      const importPath = line.slice(`@import './parts/`.length).replaceAll("'", '').replaceAll(';', '').trim()
      parts.push(importPath)
    }
  }
  return parts
}

const toSorted = (array) => {
  return [...array].sort().reverse()
}

export const bundleCss = async ({ outDir, additionalCss = '', assetDir = '', pathPrefix = '' }) => {
  let css = ``
  const cssLibNormalize = join(Root.root, 'static', 'lib-css', 'modern-normalize.css')
  if (additionalCss) {
    css += additionalCss
    css += '\n\n'
  }
  const cssLibTermTerm = join(Root.root, 'static', 'lib-css', 'termterm.css')
  css += await readFile(cssLibNormalize, EncodingType.Utf8)
  css += '\n'
  css += await readFile(cssLibTermTerm, EncodingType.Utf8)
  css += '\n'
  const appCss = await readFile(join(Root.root, 'static', 'css', 'App.css'), EncodingType.Utf8)
  const parts = getParts(appCss)
  const cwd = join(Root.root, 'static', 'css', 'parts')
  const dirents = await readdir(cwd)
  const sortedDirents = toSorted(dirents)
  console.log({ sortedDirents })
  for (const dirent of sortedDirents) {
    if (parts.includes(dirent)) {
      // ignore
    } else {
      await Copy.copy({
        from: `static/css/parts/${dirent}`,
        to: Path.join(outDir, 'parts', dirent),
      })
    }
  }

  for (const part of parts) {
    const absolutePath = join(cwd, part)
    const content = await readFile(absolutePath, EncodingType.Utf8)
    css += `/*************/\n`
    css += `/* ${part} */\n`
    css += `/*************/\n`
    css += content
  }

  const appCssPath = Path.join(outDir, 'App.css')
  await WriteFile.writeFile({
    to: appCssPath,
    content: css,
  })

  await Replace.replace({
    path: appCssPath,
    occurrence: `url(/icons/`,
    replacement: `url(${assetDir}/icons/`,
  })
  await Replace.replace({
    path: Path.join(outDir, 'parts', 'ViewletTitleBarButtons.css'),
    occurrence: `url(/icons/`,
    replacement: `url(${assetDir}/icons/`,
  })
  await Replace.replace({
    path: Path.join(outDir, 'parts', 'EditorTabs.css'),
    occurrence: `url(/icons/`,
    replacement: `url(${assetDir}/icons/`,
  })
  await Replace.replace({
    path: Path.join(outDir, 'parts', 'ViewletTitleBarIcon.css'),
    occurrence: `url(/icons/`,
    replacement: `url(${assetDir}/icons/`,
  })
  await Replace.replace({
    path: Path.join(outDir, 'parts', 'ViewletEditorCompletion.css'),
    occurrence: `url(/icons/`,
    replacement: `url(${assetDir}/icons/`,
  })
  await Replace.replace({
    path: appCssPath,
    occurrence: `url(/fonts/`,
    replacement: `url(${assetDir}/fonts/`,
  })
}
