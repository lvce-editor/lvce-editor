import { readFile, writeFile } from 'fs/promises'
import { pathToFileURL } from 'url'
import { VError } from '@lvce-editor/verror'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCssDeclarationFiles from '../GetCssDeclarationFiles/GetCssDeclarationFiles.js'
import * as GetFilteredCssDeclarations from '../GetFilteredCssDeclarations/GetFilteredCssDeclarations.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

const getNewCssDeclarationFile = (content, filteredCss) => {
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

const getPlatformCode = (platform) => {
  switch (platform) {
    case 'electron':
      return `PlatformType.Electron`
    case 'remote':
      // workaround for rollup treeshaking out platform variable
      // which is still needed for static web export
      return `globalThis.PLATFORM = PlatformType.Remote`
    case 'web':
      return 'PlatformType.Web'
    default:
      throw new Error(`unsupported platform ${platform}`)
  }
}

export const bundleRendererWorker = async ({ cachePath, platform, commitHash, assetDir }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/src',
      to: Path.join(cachePath, 'src'),
    })
    const cssDeclarationFiles = await GetCssDeclarationFiles.getCssDeclarationFiles(cachePath)
    for (const file of cssDeclarationFiles) {
      const url = pathToFileURL(file).toString()
      const module = await import(url)
      const Css = module.Css
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
    for (const file of ['PrettyBytes', 'BabelParser', 'Blob', 'Base64', 'Ajax', 'Markdown', 'IndexedDb']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
        occurrence: `../../../../../static/`,
        replacement: `../../../static/`,
      })
    }
    await Replace.replace({
      path: `${cachePath}/src/parts/AssetDir/AssetDir.js`,
      occurrence: `ASSET_DIR`,
      replacement: `'${assetDir}'`,
    })
    const platformCode = getPlatformCode(platform)
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: 'export const platform = getPlatform()',
      replacement: `export const platform = ${platformCode}`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
      replacement: `/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
    })

    if (platform === 'remote') {
      await Replace.replace({
        path: `${cachePath}/src/parts/GetIconThemeCss/GetIconThemeCss.js`,
        occurrence: `import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'`,
        replacement: `import * as AssetDir from '../AssetDir/AssetDir.js'`,
      })
      await Replace.replace({
        path: `${cachePath}/src/parts/GetIconThemeCss/GetIconThemeCss.js`,
        occurrence: `const getBackgroundUrl = (extensionPath, value) => {
  if (Platform.platform === PlatformType.Web) {
    return \`\${extensionPath}\${value}\`
  }
  if (extensionPath.startsWith('http://')) {
    return \`\${extensionPath}\${value}\`
  }
  // TODO what if the file in on linux and includes a backslash?
  if (extensionPath.includes('\\\\')) {
    const extensionUri = extensionPath.replaceAll('\\\\', '/')
    return \`/remote/\${extensionUri}/\${value}\`
  }
  return \`/remote\${extensionPath}/\${value}\`
}`,
        replacement: `const getBackgroundUrl = (extensionPath, value) => {
  return \`\${AssetDir.assetDir}\${value}\`
}`,
      })
    }
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/rendererWorkerMain.js`,
      platform: 'webworker',
      allowCyclicDependencies: true, // TODO
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererWorkerMain.js`,
      occurrence: `const platform = globalThis.PLATFORM = Remote;`,
      replacement: `const platform = Remote;
`,
    })
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer worker`)
  }
}
