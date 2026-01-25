import { existsSync } from 'node:fs'
import * as AddRootPackageJson from '../AddRootPackageJson/AddRootPackageJson.js'
import * as Assert from '../Assert/Assert.js'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleMainProcessCached from '../BundleMainProcessCached/BundleMainProcessCached.js'
import * as BundleOptions from '../BundleOptions/BundleOptions.js'
import * as BundleSharedProcessCached from '../BundleSharedProcessCached/BundleSharedProcessCached.js'
import * as BundleWorkers from '../BundleWorkers/BundleWorkers.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Copy from '../Copy/Copy.js'
import * as CopyElectron from '../CopyElectron/CopyElectron.js'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.js'
import * as GetElectronVersion from '../GetElectronVersion/GetElectronVersion.js'
import * as Hash from '../Hash/Hash.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Rename from '../Rename/Rename.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveUnusedLocales from '../RemoveUnusedLocales/RemoveUnusedLocales.js'
import * as Replace from '../Replace/Replace.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import { generateConfigJson } from '../GenerateConfigJson/GenerateConfigJson.js'

const getDependencyCacheHash = async ({ electronVersion, arch, supportsAutoUpdate, isMacos, isArchLinux, isAppImage }) => {
  const files = [
    'packages/main-process/package-lock.json',
    'packages/shared-process/package-lock.json',
    'packages/extension-host-helper-process/package-lock.json',
    'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'packages/build/src/parts/BundleElectronAppDependencies/BundleElectronAppDependencies.js',
    'packages/build/src/parts/BundleExtensionHostDependencies/BundleExtensionHostDependencies.js',
    'packages/build/src/parts/BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js',
    'packages/build/src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.js',
    'packages/build/src/parts/FilterSharedProcessDependencies/FilterSharedProcessDependencies.js',
    'packages/build/src/parts/CopyDependencies/CopyDependencies.js',
    'packages/build/src/parts/BundleMainProcessDependencies/BundleMainProcessDependencies.js',
    'packages/build/src/parts/NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js',
    'packages/build/src/parts/NpmDependencies/NpmDependencies.js',
    'packages/build/src/parts/WalkDependencies/WalkDependencies.js',
    'packages/build/src/parts/Rebuild/Rebuild.js',
  ]
  const absolutePaths = files.map(Path.absolute)
  const contents = await Promise.all(absolutePaths.map(ReadFile.readFile))
  const hash = Hash.computeHash(
    contents + electronVersion + arch + String(supportsAutoUpdate) + String(isMacos) + String(isArchLinux) + String(isAppImage),
  )
  return hash
}

const downloadElectron = async ({ platform, arch, electronVersion }) => {
  const outDir = Path.join(Root.root, 'build', '.tmp', 'cachedElectronVersions', `electron-${electronVersion}-${platform}-${arch}`)
  const DownloadElectron = await import('../DownloadElectron/DownloadElectron.js')
  await DownloadElectron.downloadElectron({
    electronVersion,
    outDir,
    platform,
    arch,
  })
}

const copyDependencies = async ({ cachePath, resourcesPath }) => {
  await Copy.copy({
    from: cachePath,
    to: `${resourcesPath}/app/packages`,
  })
}

const copyPlaygroundFiles = async ({ arch, resourcesPath }) => {
  await WriteFile.writeFile({
    to: `${resourcesPath}/app/playground/index.html`,
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="index.css" />
    <title>Document</title>
  </head>
  <body>
    <h1>hello world</h1>
  </body>
</html>
`,
  })
  await WriteFile.writeFile({
    to: `${resourcesPath}/app/playground/index.css`,
    content: `h1 { color: dodgerblue; }`,
  })
}

const copyExtensionHostHelperProcessSources = async ({ resourcesPath }) => {
  await Copy.copy({
    from: 'packages/extension-host-helper-process/src',
    to: `${resourcesPath}/app/packages/extension-host-helper-process/src`,
  })
}

const quickJoinPath = (prefix, postfix) => {
  if (postfix.startsWith('./')) {
    return prefix + '/' + postfix.slice('./'.length)
  }
  return prefix + '/' + postfix
}

const removeSrcPrefix = (postfix) => {
  if (postfix.startsWith('./src/')) {
    return postfix.slice('./src/'.length)
  }
  if (postfix.startsWith('./src')) {
    return postfix.slice('./src'.length)
  }
  if (postfix.startsWith('src/')) {
    return postfix.slice('src/'.length)
  }
  if (postfix.startsWith('src')) {
    return postfix.slice('src'.length)
  }
  return postfix
}

const copyExtensions = async ({ optimizeLanguageBasics, resourcesPath }) => {
  await Copy.copy({
    from: 'extensions',
    to: `${resourcesPath}/app/extensions`,
    dereference: true,
  })

  await Remove.remove(`${resourcesPath}/app/extensions/builtin.language-features-html/typescript`)
  await Replace.replace({
    path: `${resourcesPath}/app/extensions/builtin.language-features-html/html-worker/src/parts/TypeScriptPath/TypeScriptPath.js`,
    occurrence: '../../../../typescript/lib/typescript-esm.js',
    replacement: '../../../../../builtin.language-features-typescript/typescript/lib/typescript-esm.js',
  })
  // await Copy.copy({
  //   from: `${resourcesPath}/app/extensions/builtin.vscode-icons/icons`,
  //   to: `${resourcesPath}/app/static/file-icons`,
  // })
  // await Remove.remove(`${resourcesPath}/app/extensions/builtin.vscode-icons/icons`)
  // await Replace.replace({
  //   path: `${resourcesPath}/app/extensions/builtin.vscode-icons/icon-theme.json`,
  //   occurrence: '/icons',
  //   replacement: '/file-icons',
  // })
  if (optimizeLanguageBasics) {
    const dirents = await ReadDir.readDir(`${resourcesPath}/app/extensions`)
    const allLanguages = []
    for (const dirent of dirents) {
      if (!dirent.startsWith('builtin.language-basics-')) {
        continue
      }
      const postfix = dirent.slice('builtin.language-basics-'.length)
      const extensionJson = await JsonFile.readJson(`${resourcesPath}/app/extensions/${dirent}/extension.json`)
      if (extensionJson && extensionJson.languages && Array.isArray(extensionJson.languages)) {
        for (const language of extensionJson.languages) {
          if (language.configuration) {
            language.configuration = quickJoinPath(postfix, language.configuration)
          }
          if (language.tokenize) {
            language.tokenize = quickJoinPath(postfix, removeSrcPrefix(language.tokenize))
          }
          allLanguages.push(language)
        }
      }
      await Copy.copy({
        from: `${resourcesPath}/app/extensions/${dirent}/src`,
        to: `${resourcesPath}/app/extensions/builtin.language-basics/${postfix}`,
      })
      if (existsSync(Path.absolute(`${resourcesPath}/app/extensions/${dirent}/languageConfiguration.json`))) {
        await Copy.copy({
          from: `${resourcesPath}/app/extensions/${dirent}/languageConfiguration.json`,
          to: `${resourcesPath}/app/extensions/builtin.language-basics/${postfix}/languageConfiguration.json`,
        })
      }
      await Remove.remove(`${resourcesPath}/app/extensions/${dirent}`)
    }
    await JsonFile.writeJson({
      to: `${resourcesPath}/app/extensions/builtin.language-basics/extension.json`,
      value: {
        id: 'builtin.language-basics',
        name: 'Language Basics',
        description: 'Provides syntax highlighting and bracket matching in files.',
        languages: allLanguages,
      },
    })
    await WriteFile.writeFile({
      to: `${resourcesPath}/app/extensions/builtin.language-basics/README.md`,
      content: `# Language Basics

Syntax highlighting for Lvce Editor.

For performance reason, all languages extensions are bundled into one during build.
`,
    })
  }
}

const copyStaticFiles = async ({ resourcesPath, commitHash }) => {
  await Copy.copy({
    from: 'static',
    to: `${resourcesPath}/app/static/${commitHash}`,
    ignore: ['css'],
  })
  await Remove.remove(`${resourcesPath}/app/static/icons/pwa-icon-512.png`)
  await Rename.rename({
    from: `${resourcesPath}/app/static/${commitHash}/index.html`,
    to: `${resourcesPath}/app/static/index.html`,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
    replacement: `${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: '/css/App.css',
    replacement: `/${commitHash}/css/App.css`,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: '\n    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: '\n    <link rel="apple-touch-icon" href="/icons/pwa-icon-192.png" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: '\n    <meta name="theme-color" content="#282e2f" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `${resourcesPath}/app/static/index.html`,
    occurrence: '\n    <meta name="description" content="VS Code inspired text editor that mostly runs in a webworker." />',
    replacement: ``,
  })
  await Remove.remove(`${resourcesPath}/app/static/manifest.json`)
  await Remove.remove(`${resourcesPath}/app/static/favicon.ico`)
  await Remove.remove(`${resourcesPath}/app/static/images`)
  await Remove.remove(`${resourcesPath}/app/static/sounds`)
  await Remove.remove(`${resourcesPath}/app/static/lib-css/modern-normalize.css`)
}

const copyCss = async ({ resourcesPath, commitHash }) => {
  await BundleCss.bundleCss({
    outDir: `${resourcesPath}/app/static/${commitHash}/css`,
  })
}

const removeUnusedCode = async ({ resourcesPath }) => {
  await Remove.remove(Path.absolute(`${resourcesPath}/app/packages/test-worker`))
}

export const build = async ({
  product,
  version = '0.0.0-dev',
  supportsAutoUpdate = false,
  shouldRemoveUnusedLocales = false,
  arch = process.arch,
  platform = process.platform,
  isMacos = process.platform === 'darwin',
  isArchLinux = false,
  isAppImage = false,
  target,
}) => {
  Assert.object(product)
  Assert.string(version)
  const { electronVersion, isInstalled, installedArch, installedPlatform } = await GetElectronVersion.getElectronVersion()
  const dependencyCacheHash = await getDependencyCacheHash({
    electronVersion,
    arch,
    supportsAutoUpdate,
    isMacos,
    isArchLinux,
    isAppImage,
  })
  const dependencyCachePath = Path.join(Path.absolute('packages/build/.tmp/cachedDependencies'), dependencyCacheHash)
  const dependencyCachePathFinished = Path.join(dependencyCachePath, 'finished')
  const commitHash = await CommitHash.getCommitHash()
  const date = await GetCommitDate.getCommitDate(commitHash)
  const bundleMainProcess = BundleOptions.bundleMainProcess
  const bundleSharedProcess = BundleOptions.bundleSharedProcess
  const isLinux = Platform.isLinux()
  const optimizeLanguageBasics = true
  const resourcesPath = isMacos
    ? `packages/build/.tmp/electron-bundle/${arch}/${product.applicationName}.app/Contents/Resources`
    : `packages/build/.tmp/electron-bundle/${arch}/resources`

  const useInstalledElectronVersion = isInstalled && installedArch === arch && installedPlatform === platform
  if (!useInstalledElectronVersion) {
    console.time('downloadElectron')
    await downloadElectron({
      arch,
      electronVersion,
      platform,
    })
    console.timeEnd('downloadElectron')
  }

  if (existsSync(dependencyCachePath) && existsSync(dependencyCachePathFinished)) {
    Logger.info('[build step skipped] bundleElectronAppDependencies')
  } else {
    console.time('bundleElectronAppDependencies')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedDependencies'))
    const BundleElectronAppDependencies = await import('../BundleElectronAppDependencies/BundleElectronAppDependencies.js')
    await BundleElectronAppDependencies.bundleElectronAppDependencies({
      cachePath: dependencyCachePath,
      arch,
      electronVersion,
      product,
      supportsAutoUpdate,
      bundleMainProcess,
      platform,
      target,
    })
    console.timeEnd('bundleElectronAppDependencies')
  }

  console.time('copyElectron')
  await CopyElectron.copyElectron({
    arch,
    electronVersion,
    useInstalledElectronVersion,
    product,
    platform,
    version,
  })
  console.timeEnd('copyElectron')

  if (shouldRemoveUnusedLocales) {
    console.time('removeUnusedLocales')
    await RemoveUnusedLocales.removeUnusedLocales({ arch, isMacos, product })
    console.timeEnd('removeUnusedLocales')
  }

  console.time('copyDependencies')
  await copyDependencies({
    cachePath: dependencyCachePath,
    resourcesPath,
  })
  console.timeEnd('copyDependencies')

  const mainProcessCachePath = await BundleMainProcessCached.bundleMainProcessCached({
    commitHash,
    product,
    version,
    bundleMainProcess,
    bundleSharedProcess,
    isArchLinux,
    isAppImage,
    isLinux,
  })

  console.time('copyMainProcessFiles')
  await Copy.copy({
    from: mainProcessCachePath,
    to: `${resourcesPath}/app/packages/main-process`,
  })
  console.timeEnd('copyMainProcessFiles')

  const sharedProcessCachePath = await BundleSharedProcessCached.bundleSharedProcessCached({
    commitHash,
    product,
    version,
    bundleSharedProcess,
    date,
    target,
    isArchLinux,
    isAppImage,
  })

  console.time('copySharedProcessFiles')
  await Copy.copy({
    from: sharedProcessCachePath,
    to: `${resourcesPath}/app/packages/shared-process`,
  })
  console.timeEnd('copySharedProcessFiles')

  console.time('copyExtensionHostHelperProcessSources')
  await copyExtensionHostHelperProcessSources({ resourcesPath })
  console.timeEnd('copyExtensionHostHelperProcessSources')

  console.time('copyExtensions')
  await copyExtensions({ optimizeLanguageBasics, resourcesPath })
  console.timeEnd('copyExtensions')

  console.time('copyStaticFiles')
  await copyStaticFiles({ resourcesPath, commitHash })
  console.timeEnd('copyStaticFiles')

  console.time('copyCss')
  await copyCss({ resourcesPath, commitHash })
  console.timeEnd('copyCss')

  const assetDir = `/${commitHash}`
  const toRoot = `${resourcesPath}/app/static/${commitHash}`

  await BundleWorkers.bundleWorkers({
    platform: 'electron',
    assetDir,
    commitHash,
    version,
    date,
    toRoot,
    product,
  })

  console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ arch, resourcesPath })
  console.timeEnd('copyPlaygroundFiles')

  const etag = `W/"${commitHash}"`

  await generateConfigJson({
    etag,
    configRoot: Path.absolute(`${resourcesPath}/app`),
    staticRoot: Path.absolute(`${resourcesPath}/app`),
  })

  console.time('addRootPackageJson')
  await AddRootPackageJson.addRootPackageJson({
    electronVersion,
    product,
    cachePath: Path.absolute(`${resourcesPath}/app`),
    bundleMainProcess,
    version,
  })
  console.timeEnd('addRootPackageJson')

  await removeUnusedCode({
    resourcesPath,
  })

  await WriteFile.writeFile({
    to: dependencyCachePathFinished,
    content: '1',
  })
}
