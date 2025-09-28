import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.js'
import * as Replace from '../Replace/Replace.js'

const getPlatformCode = (platform) => {
  switch (platform) {
    case 'electron':
      return `Electron`
    case 'remote':
      return `Remote`
    case 'web':
      return 'Web'
    default:
      throw new Error(`unsupported platform ${platform}`)
  }
}

export const bundleRendererProcess = async ({ cachePath, commitHash, platform, assetDir }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process',
      to: `${cachePath}`,
    })
    // TODO renderer process should make it easier to adjust paths
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: '/packages/renderer-worker/src/rendererWorkerMain.ts',
      replacement: `/packages/renderer-worker/dist/rendererWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: `const assetDir = getAssetDir();`,
      replacement: `const assetDir = '${assetDir}';`,
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: `const syntaxHighlightingWorkerUrl = getConfiguredSyntaxHighlightingWorkerUrl() || \`\${assetDir}/packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js\`;`,
      replacement: `const syntaxHighlightingWorkerUrl = \`\${assetDir}/packages/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js\`;`,
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: `const extensionHostWorkerUrl = getConfiguredExtensionHostWorkerUrl() || \`\${assetDir}/packages/renderer-worker/node_modules/@lvce-editor/extension-host-worker/dist/extensionHostWorkerMain.js\`;`,
      replacement: 'const extensionHostWorkerUrl = `${assetDir}/packages/extension-host-worker/dist/extensionHostWorkerMain.js`;',
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: `const editorWorkerUrl = \`\${assetDir}/packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js\`;`,
      replacement: 'const editorWorkerUrl = getConfiguredEditorWorkerUrl() || `${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`;',
    })
    const platformCode = getPlatformCode(platform)
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: 'const platform = getPlatform();',
      replacement: `const platform = ${platformCode};`,
    })
    if (platform === 'electron') {
      await Replace.replace({
        path: `${cachePath}/dist/rendererProcessMain.js`,
        occurrence: `const isFirefox = getIsFirefox()`,
        replacement: `const isFirefox = false`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
