import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleIconThemeWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/icon-theme-worker/dist/iconThemeWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iconThemeWorkerMain.js'),
  })

  // TODO should adjust vscode-icons.json instead
  await Replace.replace({
    path: `${cachePath}/dist/iconThemeWorkerMain.js`,
    occurrence: `import * as IconThemeState from '../IconThemeState/IconThemeState.js'
  import * as AssetDir from '../AssetDir/AssetDir.js'

  export const getAbsoluteIconPath = (iconTheme, icon) => {
    const result = iconTheme.iconDefinitions[icon]
    return \`\${AssetDir.assetDir}/file-icons/\${result.slice(12)}\`
  }`,
    replacement: ``,
  })

  await Replace.replace({
    path,
    occurrence,
    replacement,
  })
}
