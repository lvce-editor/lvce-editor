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

export const bundleExtensionHostWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-host-worker/dist/extensionHostWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'extensionHostWorkerMain.js'),
  })
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  const platformCode = getPlatformCode(platform)
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `const platform = getPlatform()`,
    replacement: `const platform = ${platformCode}`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'${assetDir}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
  if (platform === 'web') {
    await Replace.replace({
      path: `${cachePath}/dist/extensionHostWorkerMain.js`,
      occurrence: `return \`\${assetDir}/extensions/builtin.theme-\${colorThemeId}/color-theme.json\``,
      replacement: `return \`\${assetDir}/themes/\${colorThemeId}.json\``,
    })
    await Replace.replace({
      path: `${cachePath}/dist/extensionHostWorkerMain.js`,
      occurrence: `return \`\${assetDir}/extensions/builtin.\${iconThemeId}/icon-theme.json\``,
      replacement: `return \`\${assetDir}/icon-themes/\${iconThemeId}.json\``,
    })
  }
}
