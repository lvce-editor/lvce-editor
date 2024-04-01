import { VError } from '@lvce-editor/verror'
import { readdir, readFile, rm } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.js'
import * as EagerLoadedCss from '../EagerLoadedCss/EagerLoadedCss.js'
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
  try {
    let css = ``
    const cssLibNormalize = Path.join(Root.root, 'static', 'lib-css', 'modern-normalize.css')
    if (additionalCss) {
      css += additionalCss
      css += '\n\n'
    }
    const cssLibTermTerm = Path.join(Root.root, 'static', 'lib-css', 'termterm.css')
    css += await readFile(cssLibNormalize, EncodingType.Utf8)
    css += '\n'
    css += await readFile(cssLibTermTerm, EncodingType.Utf8)
    css += '\n'
    const appCss = await readFile(Path.join(Root.root, 'static', 'css', 'App.css'), EncodingType.Utf8)
    const parts = getParts(appCss)
    const cwd = Path.join(Root.root, 'static', 'css', 'parts')
    const dirents = await readdir(cwd)
    const sortedDirents = toSorted(dirents)
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
      const absolutePath = Path.join(cwd, part)
      const content = await readFile(absolutePath, EncodingType.Utf8)
      css += `/*************/\n`
      css += `/* ${part} */\n`
      css += `/*************/\n`
      css += content
    }

    for (const file of ['MaskIcon', 'Symbol', 'ViewletProblems']) {
      await Replace.replace({
        path: Path.join(outDir, 'parts', `${file}.css`),
        occurrence: `url(/icons/`,
        replacement: `url(${assetDir}/icons/`,
      })
    }

    for (const part of EagerLoadedCss.eagerLoadedCss) {
      const absoluteOutDir = Path.absolute(outDir)
      const absolutePath = Path.join(absoluteOutDir, 'parts', part)
      const content = await readFile(absolutePath, EncodingType.Utf8)
      css += `/*************/\n`
      css += `/* ${part} */\n`
      css += `/*************/\n`
      css += content
      await rm(absolutePath, { recursive: true, force: true })
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
      path: appCssPath,
      occurrence: `url(/fonts/`,
      replacement: `url(${assetDir}/fonts/`,
    })
  } catch (error) {
    throw new VError(error, `Failed to bundle css`)
  }
}
