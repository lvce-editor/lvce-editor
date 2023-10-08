import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'

const createNewPackageJson = (oldPackageJson, bundleSharedProcess, target) => {
  const newPackageJson = {
    ...oldPackageJson,
  }
  delete newPackageJson.scripts
  delete newPackageJson.description
  delete newPackageJson.devDependencies
  delete newPackageJson.xo
  delete newPackageJson.jest
  if (target !== 'server') {
    delete newPackageJson.keywords
    delete newPackageJson.author
    delete newPackageJson.license
    delete newPackageJson.repository
    delete newPackageJson.engines
  }
  if (bundleSharedProcess) {
    newPackageJson.main = 'dist/sharedProcessMain.js'
  }
  return newPackageJson
}

export const bundleSharedProcess = async ({ cachePath, commitHash, product, version, bundleSharedProcess, date, target }) => {
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/shared-process/package.json',
    to: `${cachePath}/package.json`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `applicationName = 'lvce-oss'`,
    replacement: `applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `productNameLong = 'Lvce Editor - OSS'`,
    replacement: `productNameLong = '${product.nameLong}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `commit = 'unknown commit'`,
    replacement: `commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `version = '0.0.0-dev'`,
    replacement: `version = '${version}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `date = ''`,
    replacement: `date = '${date}'`,
  })

  if (target === 'electron-deb' || target === 'electron-builder-deb') {
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `isDeb = false`,
      replacement: `isDeb = true`,
    })
  }
  if (target === 'server') {
    await Copy.copy({
      from: 'packages/shared-process/bin',
      to: `${cachePath}/bin`,
    })
    await Copy.copy({
      from: 'packages/shared-process/index.js',
      to: `${cachePath}/index.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Root/Root.js`,
      occurrence: `export const root = resolve(__dirname, '../../../../../')`,
      replacement: `export const root = resolve(__dirname, '../../../')`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: `Path.join(appDir, 'static', 'config', 'defaultSettings.json')`,
      replacement: `Path.join(Root.root, 'config', 'defaultSettings.json')`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Env/Env.js`,
      occurrence: `return process.env.FOLDER`,
      replacement: `return process.env.FOLDER || process.cwd()`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: `export const getExtensionHostHelperProcessPath = async () => {
  return Path.join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
}
`,
      replacement: `export const getExtensionHostHelperProcessPath = async () => {
  const { extensionHostHelperProcessPath } = await import(
    '@lvce-editor/extension-host-helper-process'
  )
  return extensionHostHelperProcessPath
}
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: `export const getExtensionHostPath = async () => {
  return join(Root.root, 'packages', 'extension-host', 'src', 'extensionHostMain.js')
}
`,
      replacement: `export const getExtensionHostPath = async () => {
  const { extensionHostPath } = await import(
    '@lvce-editor/extension-host'
  )
  return extensionHostPath
}
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PtyHostPath/PtyHostPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getPtyHostPath = async () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
`,
      replacement: `import * as Root from '../Root/Root.js'
import * as Path from '../Path/Path.js'

export const getPtyHostPath = async () => {
  try {
    const { ptyHostPath } = await import('@lvce-editor/pty-host')
    return ptyHostPath
  } catch {
    return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
  }
}
`,
    })
    await Copy.copyFile({
      from: 'LICENSE',
      to: `${cachePath}/LICENSE`,
    })
    await Copy.copy({
      from: 'static/config',
      to: `${cachePath}/config`,
    })
  }

  if (bundleSharedProcess) {
    await Copy.copy({
      from: 'packages/shared-process/node_modules',
      to: Path.join(cachePath, 'node_modules'),
      ignore: ['vscode-ripgrep-with-github-api-error-fix', '@types', 'type-fest', '.bin', 'is-docker'],
      dereference: true,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Root/Root.js`,
      occurrence: `resolve(__dirname, '../../../../../')`,
      replacement: `resolve(__dirname, '../../../')`,
    })
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/sharedProcessMain.js`,
      platform: 'node',
      external: ['tmp-promise', '@lvce-editor/pretty-error', '@vscode/windows-process-tree'],
      codeSplitting: true,
    })
    await Remove.remove(`${cachePath}/dist/renderer-process.modern.js`)
    await Remove.remove(`${cachePath}/dist/renderer-process.modern.js.map`)
    await Replace.replace({
      path: `${cachePath}/src/parts/Root/Root.js`,
      occurrence: `resolve(__dirname, '../../../')`,
      replacement: `resolve(__dirname, '../../../../../')`,
    })
  }
  const oldPackageJson = await JsonFile.readJson(`${cachePath}/package.json`)
  const newPackageJson = createNewPackageJson(oldPackageJson, bundleSharedProcess, target)
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: newPackageJson,
  })
}
