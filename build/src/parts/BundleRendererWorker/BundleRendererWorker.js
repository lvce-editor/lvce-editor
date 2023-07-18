import { readFile, writeFile } from 'fs/promises'
import VError from 'verror'
import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as EagerLoadedCss from '../EagerLoadedCss/EagerLoadedCss.js'
import * as GetCssDeclarationFiles from '../GetCssDeclarationFiles/GetCssDeclarationFiles.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

const isEagerLoaded = (cssDeclaration) => {
  for (const eagerLoaded of EagerLoadedCss.eagerLoadedCss) {
    if (cssDeclaration.endsWith(`/${eagerLoaded}`)) {
      return true
    }
  }
  return false
}

const getFilteredCssDeclarations = (cssDeclarations) => {
  const filtered = []
  for (const cssDeclaration of cssDeclarations) {
    if (!isEagerLoaded(cssDeclaration)) {
      filtered.push(cssDeclaration)
    }
  }
  return filtered
}

const getNewCssDeclarionFile = (content, filteredCss) => {
  const lines = content.split('\n')
  const newLines = []
  let skip = false
  for (const line of lines) {
    if (line.startsWith('export const Css')) {
      newLines.push(`export const Css = ${JSON.stringify(filteredCss)}`)
      skip = true
    }
    if (!skip) {
      newLines.push(line)
    }
    if (skip && line.endsWith(']')) {
      skip = false
    }
  }
  return newLines.join('\n')
}

export const bundleRendererWorker = async ({ cachePath, platform, commitHash, assetDir }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/src',
      to: Path.join(cachePath, 'src'),
    })
    const cssDeclarationFiles = await GetCssDeclarationFiles.getCssDeclarationFiles(cachePath)
    for (const file of cssDeclarationFiles) {
      const module = await import(file)
      const Css = module.Css
      if (Css) {
        const content = await readFile(file, 'utf8')
        const filteredDeclarations = getFilteredCssDeclarations(Css)
        const newContent = getNewCssDeclarionFile(content, filteredDeclarations)
        await writeFile(file, newContent)
      }
    }
    await Copy.copy({
      from: 'static/js',
      to: Path.join(cachePath, 'static', 'js'),
    })
    for (const file of ['PrettyBytes', 'BabelParser', 'Blob', 'Base64', 'Ajax', 'Markdown', 'IndexedDb']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
        occurrence: `../../../../../static/`,
        replacement: `../../../static/`,
      })
    }
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `ASSET_DIR`,
      replacement: `'${assetDir}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: 'export const platform = getPlatform()',
      replacement: `export const platform = '${platform}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
      replacement: `/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
    })
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/rendererWorkerMain.js`,
      platform: 'webworker',
    })
    // workaround for firefox bug
    await Replace.replace({
      path: `${cachePath}/dist/rendererWorkerMain.js`,
      occurrence: `//# sourceMappingURL`,
      replacement: `export {}
//# sourceMappingURL`,
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to bundle renderer worker`)
  }
}
