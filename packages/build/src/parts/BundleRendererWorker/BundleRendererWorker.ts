import { VError } from '@lvce-editor/verror'
import { readFile, writeFile } from 'node:fs/promises'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.ts'
import * as Copy from '../Copy/Copy.ts'
import * as FilterWorkerViewletCss from '../FilterWorkerViewletCss/FilterWorkerViewletCss.ts'
import * as GetCssDeclarationFiles from '../GetCssDeclarationFiles/GetCssDeclarationFiles.ts'
import * as GetFilteredCssDeclarations from '../GetFilteredCssDeclarations/GetFilteredCssDeclarations.ts'
import * as Path from '../Path/Path.ts'
import * as Replace from '../Replace/Replace.ts'
import * as Remove from '../Remove/Remove.ts'

const getNewCssDeclarationFile = (content, filteredCss) => {
  const lines = content.split('\n')
  const newLines: any[] = []
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

const getCssDeclarationsFromText = (content) => {
  const lines = content.split('\n')
  const newLines: any[] = []
  let skip = true
  for (const line of lines) {
    if (line.startsWith('export const Css')) {
      skip = false
    }
    if (!skip) {
      newLines.push(line)
    }
    if (!skip && line.includes(']')) {
      skip = true
    }
  }
  const halfParsed = newLines.join('\n')
  const almostParsed = halfParsed
    .replace('export const Css =', '')
    .replaceAll("'", '"')
    .replace(',\n]', '\n]')
    .replaceAll(/\/\/.*/g, '')
  const parsed = JSON.parse(almostParsed)
  return parsed
}

const filterWorkerViewletCss = async (cachePath) => {
  const workersJsonPath = Path.join(cachePath, 'src', 'parts', 'Workers', 'Workers.json')
  const content = await readFile(workersJsonPath, 'utf8')
  const workers = JSON.parse(content)
  const filteredWorkers = FilterWorkerViewletCss.filterWorkerViewletCss(workers)
  await writeFile(workersJsonPath, `${JSON.stringify(filteredWorkers, undefined, 2)}\n`)
}

export const bundleRendererWorker = async ({ cachePath, platform, commitHash, version, date, product, iconThemeEtag }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/src',
      to: Path.join(cachePath, 'src'),
    })
    await filterWorkerViewletCss(cachePath)
    const cssDeclarationFiles = await GetCssDeclarationFiles.getCssDeclarationFiles(cachePath)
    for (const file of cssDeclarationFiles) {
      const content = await readFile(file, 'utf8')
      const Css = getCssDeclarationsFromText(content)
      if (Css) {
        const content = await readFile(file, 'utf8')
        const filteredDeclarations = GetFilteredCssDeclarations.getFilteredCssDeclarations(Css)
        const newContent = getNewCssDeclarationFile(content, filteredDeclarations)
        await writeFile(file, newContent)
      }
    }
    await Copy.copy({
      from: 'static/js',
      to: Path.join(cachePath, 'static', 'js'),
    })
    for (const file of ['PrettyBytes', 'JsonRpc', 'RendererProcess']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
        occurrence: `../../../../../static/`,
        replacement: `../../../static/`,
      })
    }
    for (const file of ['HandleDialogWorkerMessagePort', 'HandleSecretsViewMessagePort']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.ts`,
        occurrence: `../../../../../static/`,
        replacement: `../../../static/`,
      })
    }
    for (const file of ['IpcChildModule']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
        occurrence: `/static/`,
        replacement: `../../../static/`,
      })
    }
    await Replace.replace({
      path: `${cachePath}/src/parts/Commit/Commit.js`,
      occurrence: `const commit = 'unknown commit'`,
      replacement: `const commit = '${commitHash}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IconThemeEtag/IconThemeEtag.js`,
      occurrence: `etag = ''`,
      replacement: `etag = ${JSON.stringify(iconThemeEtag)}`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Scheme/Scheme.ts`,
      occurrence: `export const WebView = 'lvce-oss-webview'`,
      replacement: `export const WebView = '${product.applicationName}-webview'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IsProduction/IsProduction.js`,
      occurrence: 'isProduction = false',
      replacement: `isProduction = true`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Product/Product.js`,
      occurrence: `applicationName = 'lvce-oss'`,
      replacement: `applicationName = '${product.applicationName}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Product/Product.js`,
      occurrence: `productNameLong = 'Lvce Editor - OSS'`,
      replacement: `productNameLong = '${product.nameLong}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Process/Process.js`,
      occurrence: `commit = 'unknown commit'`,
      replacement: `commit = '${commitHash}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Process/Process.js`,
      occurrence: `version = '0.0.0-dev'`,
      replacement: `version = '${version}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Process/Process.js`,
      occurrence: `date = ''`,
      replacement: `date = '${date}'`,
    })

    await Replace.replace({
      path: `${cachePath}/src/parts/Process/Process.js`,
      occurrence: `productNameLong = 'Lvce Editor - OSS'`,
      replacement: `productNameLong = '${product.nameLong}'`,
    })

    if (platform === 'web') {
      await Replace.replace({
        path: `${cachePath}/src/parts/Workbench/Workbench.js`,
        occurrence: `await LaunchSharedProcess.launchSharedProcess()`,
        replacement: ``,
      })
    }
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/rendererWorkerMain.ts`,
      modulePaths: [Path.absolute('packages/renderer-worker/node_modules')],
      platform: 'webworker',
      sourceMap: false,
      entryFileName: 'rendererWorkerMain.js',
    })
    await Remove.remove(`${cachePath}/src`)
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer worker`)
  }
}
