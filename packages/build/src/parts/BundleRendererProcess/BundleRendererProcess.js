import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.js'
import * as Replace from '../Replace/Replace.js'

const getPlatformCode = (platform) => {
  switch (platform) {
    case 'electron':
      return `Electron$1`
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
      occurrence: `const syntaxHighlightingWorkerUrl = \`\${assetDir}/packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js\`;`,
      replacement: `const syntaxHighlightingWorkerUrl = \`\${assetDir}/packages/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js\`;`,
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
      await Replace.replace({
        path: `${cachePath}/dist/rendererProcessMain.js`,
        occurrence: `const isMobile = getIsMobile()`,
        replacement: `const isMobile = false`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
