import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.js'
import * as InlineDynamicImportsFile from '../InlineDynamicImportsFile/InlineDynamicImportsFile.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as Version from '../Version/Version.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copyRendererProcessFiles = async ({ pathPrefix, commitHash }) => {
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/dist/${commitHash}/packages/renderer-process/src`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/AssetDir/AssetDir.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${pathPrefix}/${commitHash}'`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `PLATFORM`,
    replacement: 'PlatformType.Web',
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/IpcParentModule/IpcParentModule.js`,
    occurrence: `import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.ModuleWorker:
      return import('../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js')
    case IpcParentType.MessagePort:
      return import('../IpcParentWithMessagePort/IpcParentWithMessagePort.js')
    case IpcParentType.ReferencePort:
      return import('../IpcParentWithReferencePort/IpcParentWithReferencePort.js')
    case IpcParentType.ModuleWorkerWithMessagePort:
      return import('../IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.js')
    case IpcParentType.Electron:
      return import('../IpcParentWithElectron/IpcParentWithElectron.js')
    default:
      throw new Error('unexpected ipc type')
  }
}`,
    replacement: `import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js'
import * as IpcParentWithModuleWorkerWithMessagePort from '../IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.js'
import * as IpcParentWithMessagePort from '../IpcParentWithMessagePort/IpcParentWithMessagePort.js'
import * as IpcParentWithReferencePort from '../IpcParentWithReferencePort/IpcParentWithReferencePort.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.ModuleWorker:
      return IpcParentWithModuleWorker
    case IpcParentType.MessagePort:
      return IpcParentWithMessagePort
    case IpcParentType.ReferencePort:
      return IpcParentWithReferencePort
    case IpcParentType.ModuleWorkerWithMessagePort:
      return IpcParentWithModuleWorkerWithMessagePort
    case IpcParentType.Electron:
      return IpcParentWithElectron
    default:
      throw new Error('unexpected ipc type')
  }
}`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/RendererWorkerUrl/RendererWorkerUrl.js`,
    occurrence: `/src/rendererWorkerMain.js`,
    replacement: '/dist/rendererWorkerMain.js',
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Icon/Icon.js`,
    occurrence: `/icons`,
    replacement: `${pathPrefix}/${commitHash}/icons`,
  })
  await InlineDynamicImportsFile.inlineDynamicModules({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Module/Module.js`,
    eagerlyLoadedModules: ['Css', 'InitData', 'Layout', 'Location', 'Meta', 'Viewlet', 'WebStorage', 'Window'],
    ipcPostFix: true,
  })
  await InlineDynamicImportsFile.inlineDynamicModules({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/ViewletModule/ViewletModule.js`,
    eagerlyLoadedModules: [
      'ViewletMain',
      'ViewletLayout',
      'ViewletSideBar',
      'ViewletActivityBar',
      'ViewletTitleBar',
      'ViewletStatusBar',
      'ViewletExplorer',
      'ViewletTitleBarMenuBar',
    ],
    viewlet: true,
  })
}

const copyExtensionHostWorkerFiles = async ({ pathPrefix, commitHash }) => {
  await Copy.copy({
    from: 'packages/extension-host-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src`,
  })

  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/parts/ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.js`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'${pathPrefix}/${commitHash}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
}

const copyExtensionHostSubWorkerFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/extension-host-sub-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-sub-worker/src`,
  })
  // TODO
  // await Replace.replace({
  //   path: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/parts/Platform/Platform.js`,
  //   occurrence: `/src/extensionHostWorkerMain.js`,
  //   replacement: '/dist/extensionHostWorkerMain.js',
  // })
  // workaround for firefox module worker bug: Error: Dynamic module import is disabled or not supported in this context
}

const copyTestWorkerFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/test-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/test-worker/src`,
  })
  await Copy.copy({
    from: 'packages/terminal-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/terminal-worker/src`,
  })
}

const copyStaticFiles = async ({ pathPrefix, ignoreIconTheme, commitHash }) => {
  await Copy.copy({
    from: 'static/config',
    to: `build/.tmp/dist/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `build/.tmp/dist/${commitHash}/static/js`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `build/.tmp/dist/${commitHash}/js`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `build/.tmp/dist/favicon.ico`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `build/.tmp/dist/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/sounds',
    to: `build/.tmp/dist/sounds`,
  })
  await Copy.copyFile({
    from: 'static/manifest.json',
    to: `build/.tmp/dist/manifest.json`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/manifest.json`,
    occurrence: '/icons',
    replacement: `${pathPrefix}/${commitHash}/icons`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `build/.tmp/dist/manifest.json`,
      occurrence: '"start_url": "/"',
      replacement: `"start_url": "${pathPrefix}/"`,
    })
  }
  await Copy.copyFile({
    from: 'static/index.html',
    to: `build/.tmp/dist/index.html`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `build/.tmp/dist/index.html`,
      occurrence: '/manifest.json',
      replacement: `${pathPrefix}/manifest.json`,
    })
    await Replace.replace({
      path: `build/.tmp/dist/index.html`,
      occurrence: '</title>',
      replacement: `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`,
    })
  }
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/packages/renderer-process/src/rendererProcessMain.js',
    replacement: `${pathPrefix}/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/icons',
    replacement: `${pathPrefix}/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/css',
    replacement: `${pathPrefix}/${commitHash}/css`,
  })
  if (!ignoreIconTheme) {
    await Copy.copy({
      from: 'extensions/builtin.vscode-icons/icons',
      to: `build/.tmp/dist/${commitHash}/file-icons`,
    })
  }
  await BundleCss.bundleCss({
    outDir: `build/.tmp/dist/${commitHash}/css`,
    assetDir: `${pathPrefix}/${commitHash}`,
    pathPrefix,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `build/.tmp/dist/${commitHash}/icons`,
  })
  const languageBasics = await getLanguageBasicsNames()
  for (const languageBasic of languageBasics) {
    await Copy.copy({
      from: `extensions/${languageBasic}`,
      to: `build/.tmp/dist/${commitHash}/extensions/${languageBasic}`,
    })
  }
}

const isLanguageBasics = (name) => {
  return name.startsWith('builtin.language-basics')
}

const getLanguageBasicsNames = async () => {
  const extensionPath = Path.absolute('extensions')
  const extensions = await readdir(extensionPath)
  const languageBasics = extensions.filter(isLanguageBasics)
  return languageBasics
}

const getAbsolutePath = (extensionName) => {
  return `extensions/${extensionName}/extension.json`
}

const exists = (path) => {
  return existsSync(path)
}

const bundleLanguageJsonFiles = async ({ commitHash, pathPrefix }) => {
  const languageBasics = await getLanguageBasicsNames()
  const extensionPaths = languageBasics.map(getAbsolutePath)
  const existingExtensionPaths = extensionPaths.filter(exists)
  const extensions = await Promise.all(existingExtensionPaths.map(JsonFile.readJson))
  const getLanguages = (extension) => {
    const getLanguage = (language) => {
      return {
        ...language,
        tokenize: `${pathPrefix}/${commitHash}/extensions/${extension.id}/${language.tokenize}`,
      }
    }
    const languages = extension.languages || []
    return languages.map(getLanguage)
  }
  const languages = extensions.flatMap(getLanguages)
  await JsonFile.writeJson({
    to: `build/.tmp/dist/${commitHash}/config/languages.json`,
    value: languages,
  })
}

const applyJsOverrides = async ({ pathPrefix, commitHash }) => {}

const addRobotsTxt = async () => {
  await WriteFile.writeFile({
    to: `build/.tmp/dist/robots.txt`,
    content: `User-agent: *
Disallow: /
`,
  })
}

const addVersionFile = async ({ commitHash }) => {
  const commitMessage = await CommitHash.getCommitMessage()
  await JsonFile.writeJson({
    to: `build/.tmp/dist/version`,
    value: {
      version: commitHash,
      commitMessage,
    },
  })
}

const isTheme = (extensionName) => {
  return extensionName.startsWith('builtin.theme')
}

const isLanguageFeatures = (extensionName) => {
  return extensionName.startsWith('builtin.language-features')
}

const getThemeName = (extensionName) => {
  return extensionName.slice('builtin.theme-'.length)
}

const copyColorThemes = async ({ commitHash }) => {
  const allExtensions = await readdir(Path.absolute('extensions'))
  const themeExtensions = allExtensions.filter(isTheme)
  const themes = themeExtensions.map(getThemeName)
  for (const theme of themes) {
    await Copy.copyFile({
      from: `extensions/builtin.theme-${theme}/color-theme.json`,
      to: `build/.tmp/dist/${commitHash}/themes/${theme}.json`,
    })
  }
  await JsonFile.writeJson({
    to: `build/.tmp/dist/${commitHash}/config/themes.json`,
    value: themes,
  })
}

const copyWebExtensions = async ({ commitHash, pathPrefix }) => {
  const allExtension = await readdir(Path.absolute('extensions'))
  const languageFeatures = allExtension.filter(isLanguageFeatures)
  const webExtensions = []
  for (const languageFeature of languageFeatures) {
    let manifest
    try {
      manifest = await JsonFile.readJson(Path.absolute(`extensions/${languageFeature}/extension.json`))
    } catch (error) {
      if (IsEnoentError.isEnoentError(error)) {
        continue
      }
      throw error
    }
    if (!manifest.browser) {
      continue
    }
    await Copy.copy({
      from: `extensions/${languageFeature}`,
      to: `build/.tmp/dist/${commitHash}/extensions/${languageFeature}`,
    })
    webExtensions.push({
      ...manifest,
      path: `${pathPrefix}/${commitHash}/extensions/${languageFeature}`,
      isWeb: true,
    })
  }
  await JsonFile.writeJson({
    to: `build/.tmp/dist/${commitHash}/config/webExtensions.json`,
    value: webExtensions,
  })

  if (existsSync(Path.absolute(`build/.tmp/dist/${commitHash}/extensions/builtin.language-features-typescript`))) {
    await Copy.copy({
      from: `build/.tmp/dist/${commitHash}/extensions/builtin.language-features-typescript/node/node_modules/typescript`,
      to: `build/.tmp/dist/${commitHash}/extensions/builtin.language-features-typescript/typescript`,
    })
    await Remove.remove(`build/.tmp/dist/${commitHash}/extensions/builtin.language-features-typescript/node`)
    await Replace.replace({
      path: `build/.tmp/dist/${commitHash}/extensions/builtin.language-features-typescript/src/parts/IsWeb/IsWeb.js`,
      occurrence: 'false',
      replacement: 'true',
    })
  }
}

const copyIconThemes = async ({ commitHash }) => {
  await Copy.copyFile({
    from: 'extensions/builtin.vscode-icons/icon-theme.json',
    to: `build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
    occurrence: '/icons',
    replacement: '/file-icons',
  })
}

const bundleJs = async ({ commitHash, platform, assetDir, version, date, product }) => {
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/renderer-process`),
    from: 'src/rendererProcessMain.js',
    platform: 'web',
    codeSplitting: true,
    minify: true,
    babelExternal: true,
    typescript: true,
  })
  const rendererWorkerCachePath = await BundleRendererWorkerCached.bundleRendererWorkerCached({
    commitHash,
    platform,
    assetDir,
    version,
    date,
    product,
  })
  await Copy.copy({
    from: rendererWorkerCachePath,
    to: `build/.tmp/dist/${commitHash}/packages/renderer-worker`,
    ignore: ['static'],
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/extension-host-worker`),
    from: 'src/extensionHostWorkerMain.ts',
    platform: 'webworker',
    codeSplitting: false,
    babelExternal: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/extension-host-sub-worker`),
    from: 'src/extensionHostSubWorkerMain.js',
    platform: 'webworker',
    codeSplitting: false,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/terminal-worker`),
    from: 'src/terminalWorkerMain.ts',
    platform: 'webworker',
    codeSplitting: false,
    babelExternal: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/test-worker`),
    from: 'src/testWorkerMain.ts',
    platform: 'webworker',
    codeSplitting: false,
    babelExternal: true,
  })
}

const generateTestOverviewHtml = (dirents) => {
  const pre = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests</title>
  </head>
  <body>
    <h1>Tests</h1>
    <p>Available Tests</p>
    <ul>
`
  let middle = ``
  // TODO properly escape name
  for (const dirent of dirents) {
    const name = dirent
    middle += `      <li><a href="./${name}.html">${name}</a></li>
`
  }

  const post = `    </ul>
  </body>
</html>
`
  return pre + middle + post
}

const getName = (dirent) => {
  return dirent.name.slice(0, -'.js'.length)
}
const isTestFile = (file) => {
  return file !== '_all.js'
}

const getTestFiles = (testFilesRaw) => {
  return testFilesRaw.map(getName).filter(isTestFile)
}

const copyTestFiles = async ({ pathPrefix, commitHash }) => {
  await Copy.copy({
    from: 'packages/extension-host-worker-tests/src',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-worker-tests/src`,
    ignore: ['videos'],
  })
  await Copy.copy({
    from: 'packages/extension-host-worker-tests/fixtures',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`,
  })

  const testFilesRaw = await ReadDir.readDirWithFileTypes('packages/extension-host-worker-tests/src')
  const testFiles = getTestFiles(testFilesRaw)
  await Mkdir.mkdir(`build/.tmp/dist/${commitHash}/tests`)
  for (const testFile of testFiles) {
    await Copy.copyFile({
      from: `build/.tmp/dist/index.html`,
      to: `build/.tmp/dist/tests/${testFile}.html`,
    })
  }
  const testOverviewHtml = generateTestOverviewHtml(testFiles)
  await WriteFile.writeFile({
    to: `build/.tmp/dist/tests/index.html`,
    content: testOverviewHtml,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `build/.tmp/dist/tests/index.html`,
      occurrence: '</title>',
      replacement: `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`,
    })
  }
}

const copyPlaygroundFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: `build/files/playground-source`,
    to: `build/.tmp/dist/${commitHash}/playground`,
  })
}

export const build = async ({ product }) => {
  const commitHash = await CommitHash.getCommitHash()
  const date = await GetCommitDate.getCommitDate(commitHash)
  const pathPrefix = Platform.getPathPrefix()
  const ignoreIconTheme = Process.argv.includes('--ignore-icon-theme')
  const assetDir = `${pathPrefix}/${commitHash}`
  const platform = 'web'
  const version = await Version.getVersion()

  Console.time('clean')
  await Remove.remove('build/.tmp/dist')
  Console.timeEnd('clean')

  Console.time('copyStaticFiles')
  await copyStaticFiles({ pathPrefix, ignoreIconTheme, commitHash })
  Console.timeEnd('copyStaticFiles')

  Console.time('copyRendererProcessFiles')
  await copyRendererProcessFiles({ pathPrefix, commitHash })
  Console.timeEnd('copyRendererProcessFiles')

  Console.time('copyExtensionHostWorkerFiles')
  await copyExtensionHostWorkerFiles({ pathPrefix, commitHash })
  Console.timeEnd('copyExtensionHostWorkerFiles')

  Console.time('copyExtensionHostSubWorkerFiles')
  await copyExtensionHostSubWorkerFiles({ commitHash })
  Console.timeEnd('copyExtensionHostSubWorkerFiles')

  Console.time('copyTestWorkerFiles')
  await copyTestWorkerFiles({ commitHash })
  Console.timeEnd('copyTestWorkerFiles')

  Console.time('applyJsOverrides')
  await applyJsOverrides({ pathPrefix, commitHash })
  Console.timeEnd('applyJsOverrides')

  Console.time('bundleJs')
  await bundleJs({ commitHash, platform, assetDir, version, date, product })
  Console.timeEnd('bundleJs')

  Console.time('copyColorThemes')
  await copyColorThemes({ commitHash })
  Console.timeEnd('copyColorThemes')

  Console.time('copyWebExtensions')
  await copyWebExtensions({ commitHash, pathPrefix })
  Console.timeEnd('copyWebExtensions')

  if (!ignoreIconTheme) {
    Console.time('copyIconThemes')
    await copyIconThemes({ commitHash })
    Console.timeEnd('copyIconThemes')
  }

  Console.time('bundleLanguageJsonFiles')
  await bundleLanguageJsonFiles({ commitHash, pathPrefix })
  Console.timeEnd('bundleLanguageJsonFiles')

  Console.time('addRobotsTxt')
  await addRobotsTxt()
  Console.timeEnd('addRobotsTxt')

  Console.time('copyTestFiles')
  await copyTestFiles({ pathPrefix, commitHash })
  Console.timeEnd('copyTestFiles')

  Console.time('addVersionFile')
  await addVersionFile({ commitHash })
  Console.timeEnd('addVersionFile')

  Console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ commitHash })
  Console.timeEnd('copyPlaygroundFiles')

  // console.time('removeUnusedThings')
  // await removeUnusedThings()
  // console.timeEnd('removeUnusedThings')
}
