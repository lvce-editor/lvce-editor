import { VError } from '@lvce-editor/verror'
import { readFile, writeFile } from 'node:fs/promises'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCssDeclarationFiles from '../GetCssDeclarationFiles/GetCssDeclarationFiles.js'
import * as GetFilteredCssDeclarations from '../GetFilteredCssDeclarations/GetFilteredCssDeclarations.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

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

const getCssDeclarationsFromText = (content) => {
  const lines = content.split('\n')
  const newLines = []
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

export const bundleRendererWorker = async ({ cachePath, platform, commitHash, assetDir, version, date, product }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/src',
      to: Path.join(cachePath, 'src'),
    })
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
    for (const file of ['PrettyBytes', 'Blob', 'Idb']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
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
      occurrence: '/packages/extension-host-worker/src/extensionHostWorkerMain.ts',
      replacement: `/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TerminalWorkerUrl/TerminalWorkerUrl.js`,
      occurrence: '/packages/terminal-worker/src/terminalWorkerMain.ts',
      replacement: `/packages/terminal-worker/dist/terminalWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/EmbedsWorkerUrl/EmbedsWorkerUrl.js`,
      occurrence: '/packages/embeds-worker/src/embedsWorkerMain.ts',
      replacement: `/packages/embeds-worker/dist/embedsWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js`,
      occurrence: '/packages/syntax-highlighting-worker/src/syntaxHighlightingWorkerMain.ts',
      replacement: `/packages/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/DiffWorkerUrl/DiffWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/diff-worker/dist/diffWorkerMain.js',
      replacement: `/packages/diff-worker/dist/diffWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IsProduction/IsProduction.js`,
      occurrence: 'isProduction = false',
      replacement: `isProduction = true`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/EditorWorkerUrl/EditorWorkerUrl.js`,
      occurrence: '/packages/editor-worker/src/editorWorkerMain.ts',
      replacement: `/packages/editor-worker/dist/editorWorkerMain.js`,
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

    await WriteFile.writeFile({
      to: `${cachePath}/src/parts/GetAbsoluteIconPath/GetAbsoluteIconPath.js`,
      content: `import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const getAbsoluteIconPath = (iconTheme, icon) => {
  const result = iconTheme.iconDefinitions[icon]
  return \`\${AssetDir.assetDir}/file-icons/\${result.slice(12)}\`
}`, // TODO should adjust vscode-icons.json instead
    })

    if (platform === 'electron') {
      await Replace.replace({
        path: `${cachePath}/src/parts/IsFirefox/IsFirefox.js`,
        occurrence: `export const isFirefox = getIsFirefox()`,
        replacement: `export const isFirefox = false`,
      })
    }
    if (platform === 'web') {
      await Replace.replace({
        path: `${cachePath}/src/parts/GetIconThemeJson/GetIconThemeJson.js`,
        occurrence: `return \`\${AssetDir.assetDir}/extensions/builtin.\${iconThemeId}/icon-theme.json\``,
        replacement: `return \`\${AssetDir.assetDir}/icon-themes/\${iconThemeId}.json\``,
      })
      await Replace.replace({
        path: `${cachePath}/src/parts/Workbench/Workbench.js`,
        occurrence: `await LaunchSharedProcess.launchSharedProcess()`,
        replacement: ``,
      })
      await Replace.replace({
        path: `${cachePath}/src/parts/GetColorThemeJsonWeb/GetColorThemeJsonWeb.js`,
        occurrence: `return \`\${AssetDir.assetDir}/extensions/builtin.theme-\${colorThemeId}/color-theme.json\``,
        replacement: `return \`\${AssetDir.assetDir}/themes/\${colorThemeId}.json\``,
      })
    }
    await Replace.replace({
      path: `${cachePath}/src/parts/TestWorkerUrl/TestWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/test-worker/dist/testWorkerMain.js`,
      replacement: `/packages/test-worker/dist/testWorkerMain.js`,
    })
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/rendererWorkerMain.ts`,
      platform: 'webworker',
    })
    if (platform === 'remote') {
      await Replace.replace({
        path: `${cachePath}/dist/rendererWorkerMain.js`,
        occurrence: `const platform = globalThis.PLATFORM = Remote;`,
        replacement: `const platform = Remote;`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer worker`)
  }
}
