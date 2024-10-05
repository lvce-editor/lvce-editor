import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
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
export const bundleIframeWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/iframe-worker/dist/iframeWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iframeWorkerMain.js'),
  })
  const platformCode = getPlatformCode(platform)
  await Replace.replace({
    path: `${cachePath}/dist/iframeWorkerMain.js`,
    occurrence: `const platform = getPlatform()`,
    replacement: `const platform = ${platformCode}`,
  })
}
