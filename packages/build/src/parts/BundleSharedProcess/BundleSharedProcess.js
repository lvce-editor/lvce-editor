import { readFile, readdir, rename, writeFile } from 'fs/promises'
import { join } from 'path'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as Replace from '../Replace/Replace.js'
import * as ReplaceTs from '../ReplaceTs/ReplaceTs.js'

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
  } else {
    newPackageJson.main = 'index.js'
  }
  for (const [key, value] of Object.entries(oldPackageJson.optionalDependencies)) {
    if (key.startsWith('@lvce-editor') && value.startsWith('^')) {
      newPackageJson.optionalDependencies[key] = value.slice(1)
    }
  }
  for (const [key, value] of Object.entries(newPackageJson.dependencies)) {
    if (key.startsWith('@lvce-editor') && value.startsWith('^')) {
      newPackageJson.dependencies[key] = value.slice(1)
    }
  }
  return newPackageJson
}

export const bundleSharedProcess = async ({
  cachePath,
  commitHash,
  product,
  version,
  bundleSharedProcess,
  date,
  target,
  isArchLinux,
  isAppImage,
}) => {
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/shared-process/package.json',
    to: `${cachePath}/package.json`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/PreloadUrl/PreloadUrl.js`,
    occurrence: `join(Root.root, 'packages', 'shared-process', 'node_modules', '@lvce-editor', 'preload', 'src', 'index.js')`,
    replacement: `join(Root.root, 'static', '${commitHash}', 'packages', 'preload', 'dist', 'index.js')`,
  })
  await WriteFile.writeFile({
    to: `${cachePath}/src/parts/GetExtraHeaders/GetExtraHeaders.js`,
    content: `import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersOtherWorker from '../GetHeadersOtherWorker/GetHeadersOtherWorker.js'

export const getExtraHeaders = (pathName, fileExtension) => {
  if (pathName.endsWith('WorkerMain.js') || pathName.endsWith('WorkerMain.ts')) {
    return GetHeadersOtherWorker.getHeadersOtherWorker(pathName)
  }
  return GetHeadersDefault.getHeadersDefault()
}
`,
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
    path: `${cachePath}/src/parts/Scheme/Scheme.js`,
    occurrence: `export const WebView = 'lvce-oss-webview'`,
    replacement: `export const WebView = '${product.applicationName}-webview'`,
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
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const scheme = 'lvce-oss'`,
    replacement: `export const scheme = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const isProduction = false`,
    replacement: `export const isProduction = true`,
  })
  await WriteFile.writeFile({
    to: `${cachePath}/src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js`,
    content: `export const addCustomPathsToIndexHtml = async (content) => {
    return content
}
`,
  })
  if (isArchLinux) {
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const isArchLinux = false`,
      replacement: `export const isArchLinux = true`,
    })
  }
  if (isAppImage) {
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const isAppImage = false`,
      replacement: `export const isAppImage = true`,
    })
  }
  if (target === 'server') {
    await Replace.replace({
      path: `${cachePath}/src/parts/BuiltinExtensionsPath/BuiltinExtensionsPath.js`,
      occurrence: `import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getBuiltinExtensionsPath = () => {
  return PlatformPaths.getBuiltinExtensionsPath()
}
`,
      replacement: `import { join } from 'path'
import { fileURLToPath } from 'url'

export const getBuiltinExtensionsPath = () => {
  const staticServerPath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server'))
  const builtinExtensionsPath = join(staticServerPath, '..', '..', 'static', '${commitHash}', 'extensions')
  return builtinExtensionsPath
}
`,
    })
  }
  if (target === 'electron-deb' || target === 'electron-builder-deb') {
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `isDeb = false`,
      replacement: `isDeb = true`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const isLinux = platform === 'linux'`,
      replacement: `export const isLinux = ${Platform.isLinux()}`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const isWindows = platform === 'win32'`,
      replacement: `export const isWindows = ${Platform.isWindows()}`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `export const isMacOs = platform === 'darwin'`,
      replacement: `export const isMacOs = ${Platform.isMacos()}`,
    })
  }

  console.log({ target })
  if (target.includes('electron')) {
    console.log('replace config')
    await Replace.replace({
      path: `${cachePath}/src/parts/PlatformPaths/PlatformPaths.js`,
      occurrence: `Path.join(appDir, 'static', 'config', 'defaultSettings.json')`,
      replacement: `Path.join(Root.root, 'static', '${commitHash}', 'config', 'defaultSettings.json')`,
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
      path: `${cachePath}/src/parts/IsBuiltServer/IsBuiltServer.js`,
      occurrence: `isBuiltServer = false`,
      replacement: `isBuiltServer = true`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/IsElectron/IsElectron.js`,
      occurrence: `const isElectron = Boolean(Env.getElectronRunAsNode()) || 'electron' in process.versions`,
      replacement: `const isElectron = false`,
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
      path: `${cachePath}/src/parts/SearchProcessPath/SearchProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const searchProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'search-process',
  'dist',
  'index.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const searchProcessPath = ResolveBin.resolveBin('@lvce-editor/search-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/FileWatcherProcessPath/FileWatcherProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const fileWatcherProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'file-watcher-process',
  'dist',
  'index.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const fileWatcherProcessPath = ResolveBin.resolveBin('@lvce-editor/file-watcher-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PreviewProcessPath/PreviewProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const previewProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'preview-process',
  'dist',
  'index.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const previewProcessPath = ResolveBin.resolveBin('@lvce-editor/preview-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/TypeScriptCompileProcessPath/TypeScriptCompileProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const typescriptCompileProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'typescript-compile-process',
  'dist',
  'index.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const typescriptCompileProcessPath = ResolveBin.resolveBin('@lvce-editor/typescript-compile-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/FileSystemProcessPath/FileSystemProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const fileSystemProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'file-system-process',
  'dist',
  'index.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const fileSystemProcessPath = ResolveBin.resolveBin('@lvce-editor/file-system-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/NetworkProcessPath/NetworkProcessPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const networkProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'network-process',
  'dist',
  'networkProcessMain.js',
)
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const networkProcessPath = ResolveBin.resolveBin('@lvce-editor/network-process')
`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/PtyHostPath/PtyHostPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const ptyHostPath = Path.join(Root.root, 'packages', 'shared-process', 'node_modules', '@lvce-editor', 'pty-host', 'dist', 'ptyHostMain.js')
`,
      replacement: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const ptyHostPath = ResolveBin.resolveBin('@lvce-editor/pty-host')
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
      ignore: ['@lvce-editor/ripgrep', '@types', 'type-fest', '.bin', 'is-docker'],
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
  const dirents = await readdir(`${cachePath}/src`, { recursive: true, withFileTypes: true })
  for (const dirent of dirents) {
    const direntName = join(dirent.parentPath, dirent.name)
    if (dirent.isDirectory()) {
      continue
    }
    const content = await readFile(direntName, 'utf8')
    const newContent = await ReplaceTs.replaceTs(content)
    if (content !== newContent) {
      await writeFile(direntName, newContent)
    }
    if (direntName.endsWith('.ts')) {
      await rename(direntName, `${direntName.slice(0, -3)}.js`)
    }
  }
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: newPackageJson,
  })
}
