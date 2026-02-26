import { VError } from '@lvce-editor/verror'
import { readFile, writeFile } from 'node:fs/promises'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCssDeclarationFiles from '../GetCssDeclarationFiles/GetCssDeclarationFiles.js'
import * as GetFilteredCssDeclarations from '../GetFilteredCssDeclarations/GetFilteredCssDeclarations.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'
import * as Remove from '../Remove/Remove.js'
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
    for (const file of ['PrettyBytes', 'JsonRpc', 'RendererProcess']) {
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
      path: `${cachePath}/src/parts/Commit/Commit.js`,
      occurrence: `const commit = 'unknown commit'`,
      replacement: `const commit = '${commitHash}'`,
    })
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
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Test
  }
  // TODO find a better way to pass runtime environment
  if (typeof name !== 'undefined' && name.endsWith('(Electron)')) {
    return PlatformType.Electron
  }
  if (typeof name !== 'undefined' && name.endsWith('(Web)')) {
    return PlatformType.Web
  }
  return PlatformType.Remote
}
`,
      replacement: `export const getPlatform = () => {
  return platform
}
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Scheme/Scheme.ts`,
      occurrence: `export const WebView = 'lvce-oss-webview'`,
      replacement: `export const WebView = '${product.applicationName}-webview'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: '/packages/extension-host-worker/src/extensionHostWorkerMain.ts',
      replacement: `/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TerminalWorkerUrl/TerminalWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/terminal-worker/dist/terminalWorkerMain.js`,
      replacement: `/packages/terminal-worker/dist/terminalWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IconThemeWorkerUrl/IconThemeWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/icon-theme-worker/dist/iconThemeWorkerMain.js`,
      replacement: `/packages/icon-theme-worker/dist/iconThemeWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ExtensionManagementWorkerUrl/ExtensionManagementWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js`,
      replacement: `/packages/extension-management-worker/dist/extensionManagementWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/MainAreaWorkerUrl/MainAreaWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/main-area-worker/dist/mainAreaWorkerMain.js`,
      replacement: `/packages/main-area-worker/dist/mainAreaWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ActivityBarWorkerUrl/ActivityBarWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/activity-bar-worker/dist/activityBarWorkerMain.js`,
      replacement: `/packages/activity-bar-worker/dist/activityBarWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js',
      replacement: '/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IframeInspectorWorkerUrl/IframeInspectorWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/iframe-inspector/dist/iframeInspectorWorkerMain.js',
      replacement: '/packages/iframe-inspector/dist/iframeInspectorWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/HoverWorkerUrl/HoverWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/hover-worker/dist/hoverWorkerMain.js',
      replacement: '/packages/hover-worker/dist/hoverWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/SourceControlWorkerUrl/SourceControlWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/source-control-worker/dist/sourceControlWorkerMain.js',
      replacement: '/packages/source-control-worker/dist/sourceControlWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/StatusBarWorkerUrl/StatusBarWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/status-bar-worker/dist/statusBarWorkerMain.js',
      replacement: '/packages/status-bar-worker/dist/statusBarWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ProblemsWorkerUrl/ProblemsWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/problems-view/dist/problemsViewWorkerMain.js',
      replacement: '/packages/problems-view/dist/problemsViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/MenuWorkerUrl/MenuWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/menu-worker/dist/menuWorkerMain.js',
      replacement: '/packages/menu-worker/dist/menuWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/UpdateWorkerUrl/UpdateWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/update-worker/dist/updateWorkerMain.js',
      replacement: '/packages/update-worker/dist/updateWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/FileSystemWorkerUrl/FileSystemWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/file-system-worker/dist/fileSystemWorkerMain.js',
      replacement: '/packages/file-system-worker/dist/fileSystemWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ClipBoardWorkerUrl/ClipBoardWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/clipboard-worker/dist/clipBoardWorkerMain.js',
      replacement: '/packages/clipboard-worker/dist/clipBoardWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/RenameWorkerUrl/RenameWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/rename-worker/dist/renameWorkerMain.js',
      replacement: '/packages/rename-worker/dist/renameWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ReferencesWorkerUrl/ReferencesWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/references-view/dist/referencesViewWorkerMain.js',
      replacement: '/packages/references-view/dist/referencesViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ColorPickerWorkerUrl/ColorPickerWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/color-picker-worker/dist/colorPickerWorkerMain.js',
      replacement: '/packages/color-picker-worker/dist/colorPickerWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/FindWidgetWorkerUrl/FindWidgetWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/find-widget-worker/dist/findWidgetWorkerMain.js',
      replacement: '/packages/find-widget-worker/dist/findWidgetWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/SettingsWorkerUrl/SettingsWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/settings-view/dist/settingsViewWorkerMain.js',
      replacement: '/packages/settings-view/dist/settingsViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/CompletionWorkerUrl/CompletionWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/completion-worker/dist/completionWorkerMain.js',
      replacement: '/packages/completion-worker/dist/completionWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/KeyBindingsViewWorkerUrl/KeyBindingsViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/keybindings-view/dist/keyBindingsViewWorkerMain.js`,
      replacement: '/packages/keybindings-view-worker/dist/keyBindingsViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/DebugWorkerUrl/DebugWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/debug-worker/dist/debugWorkerMain.js`,
      replacement: '/packages/debug-worker/dist/debugWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/AboutViewWorkerUrl/AboutViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/aboutWorkerMain.js`,
      replacement: '/packages/about-view-worker/dist/aboutWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IframeWorkerUrl/IframeWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/iframe-worker/dist/iframeWorkerMain.js`,
      replacement: '/packages/iframe-worker/dist/iframeWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TextMeasurementWorkerUrl/TextMeasurementWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/text-measurement-worker/dist/textMeasurementWorkerMain.js`,
      replacement: '/packages/text-measurement-worker/dist/textMeasurementWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/OutputViewWorkerUrl/OutputViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/output-view/dist/outputViewWorkerMain.js`,
      replacement: '/packages/output-view/dist/outputViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/MarkdownWorkerUrl/MarkdownWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/markdown-worker/dist/markdownWorkerMain.js`,
      replacement: '/packages/markdown-worker/dist/markdownWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/SourceActionWorkerUrl/SourceActionWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/source-action-worker/dist/sourceActionWorkerMain.js`,
      replacement: '/packages/source-action-worker/dist/sourceActionWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TitleBarWorkerUrl/TitleBarWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/title-bar-worker/dist/titleBarWorkerMain.js`,
      replacement: '/packages/title-bar-worker/dist/titleBarWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ExtensionSearchViewWorkerUrl/ExtensionSearchViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/extension-search-view/dist/extensionSearchViewWorkerMain.js`,
      replacement: '/packages/extension-search-view-worker/dist/extensionSearchViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ExtensionDetailViewWorkerUrl/ExtensionDetailViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/extension-detail-view/dist/extensionDetailViewWorkerMain.js`,
      replacement: '/packages/extension-detail-view-worker/dist/extensionDetailViewWorkerMain.js',
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/EmbedsWorkerUrl/EmbedsWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/embeds-worker/dist/embedsWorkerMain.js`,
      replacement: `/packages/embeds-worker/dist/embedsWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`,
      replacement: `/packages/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/FileSearchWorkerUrl/FileSearchWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/file-search-worker/dist/fileSearchWorkerMain.js`,
      replacement: `/packages/file-search-worker/dist/fileSearchWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/QuickPickWorkerUrl/QuickPickWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/quick-pick-worker/dist/quickPickWorkerMain.js`,
      replacement: `/packages/quick-pick-worker/dist/quickPickWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TextSearchWorkerUrl/TextSearchWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/text-search-worker/dist/textSearchWorkerMain.js`,
      replacement: `/packages/text-search-worker/dist/textSearchWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ErrorWorkerUrl/ErrorWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/error-worker/dist/errorWorkerMain.js`,
      replacement: `/packages/error-worker/dist/errorWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/ExplorerWorkerUrl/ExplorerWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/explorer-view/dist/explorerViewWorkerMain.js`,
      replacement: `/packages/explorer-worker/dist/explorerViewWorkerMain.js`,
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
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js`,
      replacement: `/packages/editor-worker/dist/editorWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/OpenerWorkerUrl/OpenerWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/opener-worker/dist/openerWorkerMain.js`,
      replacement: `/packages/opener-worker/dist/openerWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PanelWorkerUrl/PanelWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/panel-worker/dist/panelWorkerMain.js`,
      replacement: `/packages/panel-worker/dist/panelWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PreviewWorkerUrl/PreviewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/preview-worker/dist/previewWorkerMain.js`,
      replacement: `/packages/preview-worker/dist/previewWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PreviewSandBoxWorkerUrl/PreviewSandBoxWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/preview-sandbox-worker/dist/previewSandBoxWorkerMain.js`,
      replacement: `/packages/preview-sandbox-worker/dist/previewSandBoxWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/LanguageModelsViewWorkerUrl/LanguageModelsViewWorkerUrl.js`,
      occurrence: `/packages/renderer-worker/node_modules/@lvce-editor/language-models-view/dist/languageModelsViewMain.js`,
      replacement: `/packages/language-models-view/dist/languageModelsViewMain.js`,
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
    }
    if (platform === 'web') {
      await Replace.replace({
        path: `${cachePath}/src/parts/Workbench/Workbench.js`,
        occurrence: `await LaunchSharedProcess.launchSharedProcess()`,
        replacement: ``,
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
      sourceMap: false,
    })
    if (platform === 'remote') {
      await Replace.replace({
        path: `${cachePath}/dist/rendererWorkerMain.js`,
        occurrence: `const platform = globalThis.PLATFORM = Remote;`,
        replacement: `const platform = Remote;`,
      })
    }
    await Remove.remove(`${cachePath}/src`)
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer worker`)
  }
}
