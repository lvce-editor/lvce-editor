import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as InlineDynamicImportsFile from '../InlineDynamicImportsFile/InlineDynamicImportsFile.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copyRendererProcessFiles = async ({ pathPrefix, commitHash }) => {
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/dist/${commitHash}/packages/renderer-process/src`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${pathPrefix}/${commitHash}'`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `PLATFORM`,
    replacement: "'web'",
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
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
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

const copyRendererWorkerFiles = async ({ pathPrefix, commitHash }) => {
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/IconTheme/IconTheme.js`,
    occurrence: `const getIconThemeUrl = (iconThemeId) => {
  return \`/extensions/builtin.\${iconThemeId}/icon-theme.json\`
}`,
    replacement: `const getIconThemeUrl = (iconThemeId) => {
  const assetDir = Platform.getAssetDir()
  return \`\${assetDir}/icon-themes/\${iconThemeId}.json\`
}`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/IpcParentWithNode/IpcParentWithNode.js`,
    occurrence: `const platform = getPlatform() `,
    replacement: 'const platform = PlaformType.Web',
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/IconTheme/IconTheme.js`,
    occurrence: `return \`\${extensionPath}\${value}\``,
    replacement: `return \`${pathPrefix}/file-icons/\${value.slice(7)}\``,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Workbench/Workbench.js`,
    occurrence: `await SharedProcess.listen()`,
    replacement: ``,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Workbench/Workbench.js`,
    occurrence: `import * as SharedProcess from '../SharedProcess/SharedProcess.js'`,
    replacement: ``,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${pathPrefix}/${commitHash}'`,
  })
  // TODO enable loading themes from extension folder in production, just like language basics extensions
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/ColorTheme/ColorTheme.js`,
    occurrence: `const getColorThemeUrlWeb = (colorThemeId) => {
  return \`/extensions/builtin.theme-\${colorThemeId}/color-theme.json\`
}`,

    replacement: `const getColorThemeUrlWeb = (colorThemeId) => {
  const assetDir = Platform.getAssetDir()
  return \`\${assetDir}/themes/\${colorThemeId}.json\`
}
`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: 'PLATFORM',
    replacement: `'web'`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/IpcChildModule/IpcChildModule.js`,
    occurrence: `import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
    case IpcChildType.ModuleWorker:
      return import('../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js')
    case IpcChildType.ReferencePort:
      return import('../IpcChildWithReferencePort/IpcChildWithReferencePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
`,
    replacement: `import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcChildWithMessagePort from '../IpcChildWithMessagePort/IpcChildWithMessagePort.js'
import * as IpcChildWithModuleWorker from '../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js'
import * as IpcChildWithReferencePort from '../IpcChildWithReferencePort/IpcChildWithReferencePort.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return IpcChildWithMessagePort
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    case IpcChildType.ReferencePort:
      return IpcChildWithReferencePort
    default:
      throw new Error('unexpected ipc type')
  }
}
`,
  })
  await InlineDynamicImportsFile.inlineDynamicModules({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Module/Module.js`,
    eagerlyLoadedModules: [
      'Ajax',
      'Callback',
      'ColorTheme',
      'ColorThemeFromJson',
      'IconTheme',
      'KeyBindings',
      'KeyBindingsInitial',
      'LocalStorage',
      'RecentlyOpened',
      'SaveState',
      'SessionStorage',
      'Viewlet',
      'Workbench',
      'Workspace',
    ],
    ipcPostFix: true,
  })
}

const copyExtensionHostWorkerFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/extension-host-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: `/src/extensionHostWorkerMain.js`,
    replacement: '/dist/extensionHostWorkerMain.js',
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/parts/GetExtensionHostHelperProcessUrl/GetExtensionHostHelperProcessUrl.js`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'/${commitHash}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
  // workaround for firefox module worker bug: Error: Dynamic module import is disabled or not supported in this context
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/extensionHostWorkerMain.js`,
    occurrence: `main()`,
    replacement: `main()\n\nexport const x = 42`,
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

const copyPdfWorkerFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/pdf-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/pdf-worker/src`,
  })
}

const copyStaticFiles = async ({ pathPrefix, ignoreIconTheme }) => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'static/config',
    to: `build/.tmp/dist/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `build/.tmp/dist/${commitHash}/static/js`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `build/.tmp/dist/favicon.ico`,
  })
  await Copy.copyFile({
    from: 'static/serviceWorker.js',
    to: `build/.tmp/dist/serviceWorker.js`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `build/.tmp/dist/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/images',
    to: `build/.tmp/dist/images`,
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
  await Replace.replace({
    path: `build/.tmp/dist/serviceWorker.js`,
    occurrence: `const CACHE_STATIC_NAME = 'static-v4'`,
    replacement: `const CACHE_STATIC_NAME = 'static-${commitHash}'`,
  })
  await Copy.copyFile({
    from: 'static/index.html',
    to: `build/.tmp/dist/index.html`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/fonts/',
    replacement: `${pathPrefix}/${commitHash}/fonts/`,
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
      to: `build/.tmp/dist/file-icons`,
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

/**
 * Configure caching for netlify
 * - static assets are cached for one year
 * - manifest.json is cached for one week (thats what github and reddit do, seems pretty reasonable)
 * - favicon.ico is also cached for one week
 * - index.html is cached for 10min
 */
const TEMPLATE_NETLIFY_HEADERS = `/COMMIT_HASH/*
  Cache-Control: public, max-age=31536000, immutable
  Cross-Origin-Embedder-Policy: require-corp
  X-Content-Type-Options: nosniff

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/sounds/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/file-icons/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/tests/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/manifest.json
  Cache-Control: public, max-age=604800, immutable
  X-Content-Type-Options: nosniff

/favicon.ico
  Cache-Control: public, max-age=604800, immutable
  X-Content-Type-Options: nosniff

/
  Cache-Control: public, max-age=600, immutable
  X-Content-Type-Options: nosniff
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
`

const TEMPLATE_NETLIFY_REDIRECTS = `/github/*   /index.html   200
`

const TEMPLATE_NETLIFY_NOT_FOUND_PAGE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Not Found</title>
  </head>
  <body>
    <h1>404 - Page Not Found</h1>
  </body>
</html>
`

const addNetlifyConfigFiles = async () => {
  const commitHash = await CommitHash.getCommitHash()
  const netlifyHeaders = TEMPLATE_NETLIFY_HEADERS.replaceAll('COMMIT_HASH', commitHash)
  await WriteFile.writeFile({
    to: `build/.tmp/dist/_headers`,
    content: netlifyHeaders,
  })
  await WriteFile.writeFile({
    to: `build/.tmp/dist/_redirects`,
    content: TEMPLATE_NETLIFY_REDIRECTS,
  })
  await WriteFile.writeFile({
    to: `build/.tmp/dist/404.html`,
    content: TEMPLATE_NETLIFY_NOT_FOUND_PAGE,
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
      // @ts-ignore
      if (error && error.code === ErrorCodes.ENOENT) {
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
}

const copyIconThemes = async ({ commitHash }) => {
  await Copy.copyFile({
    from: 'extensions/builtin.vscode-icons/icon-theme.json',
    to: `build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
  })
}

const bundleJs = async ({ commitHash }) => {
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/renderer-process`),
    from: 'src/rendererProcessMain.js',
    platform: 'web',
    codeSplitting: true,
    minify: true,
    babelExternal: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/renderer-worker`),
    from: 'src/rendererWorkerMain.js',
    platform: 'webworker',
    codeSplitting: true,
    allowCyclicDependencies: true, // TODO
    babelExternal: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/dist/${commitHash}/packages/extension-host-worker`),
    from: 'src/extensionHostWorkerMain.js',
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

export const build = async () => {
  const commitHash = await CommitHash.getCommitHash()
  const pathPrefix = Platform.getPathPrefix()
  const ignoreIconTheme = Process.argv.includes('--ignore-icon-theme')

  Console.time('clean')
  await Remove.remove('build/.tmp/dist')
  Console.timeEnd('clean')

  Console.time('copyStaticFiles')
  await copyStaticFiles({ pathPrefix, ignoreIconTheme })
  Console.timeEnd('copyStaticFiles')

  Console.time('copyRendererProcessFiles')
  await copyRendererProcessFiles({ pathPrefix, commitHash })
  Console.timeEnd('copyRendererProcessFiles')

  Console.time('copyRendererWorkerFiles')
  await copyRendererWorkerFiles({ pathPrefix, commitHash })
  Console.timeEnd('copyRendererWorkerFiles')

  Console.time('copyExtensionHostWorkerFiles')
  await copyExtensionHostWorkerFiles({ commitHash })
  Console.timeEnd('copyExtensionHostWorkerFiles')

  Console.time('copyExtensionHostSubWorkerFiles')
  await copyExtensionHostSubWorkerFiles({ commitHash })
  Console.timeEnd('copyExtensionHostSubWorkerFiles')

  Console.time('copyPdfWorkerFiles')
  await copyPdfWorkerFiles({ commitHash })
  Console.timeEnd('copyPdfWorkerFiles')

  Console.time('applyJsOverrides')
  await applyJsOverrides({ pathPrefix, commitHash })
  Console.timeEnd('applyJsOverrides')

  Console.time('bundleJs')
  await bundleJs({ commitHash })
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

  Console.time('addNetlifyHeaders')
  await addNetlifyConfigFiles()
  Console.timeEnd('addNetlifyHeaders')

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
