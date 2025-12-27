import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleRendererProcess from '../BundleRendererProcess/BundleRendererProcess.js'
import * as BundleWorkers from '../BundleWorkers/BundleWorkers.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as StaticContentSecurityPolicy from '../StaticContentSecurityPolicy/StaticContentSecurityPolicy.js'
import * as TranspileFiles from '../TranspileFiles/TranspileFiles.js'
import * as Version from '../Version/Version.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copyRendererProcessFiles = async ({ pathPrefix, commitHash }) => {
  await BundleRendererProcess.bundleRendererProcess({
    cachePath: `packages/build/.tmp/dist/${commitHash}/packages/renderer-process`,
    commitHash,
    platform: 'web',
    assetDir: `${pathPrefix}/${commitHash}`,
  })
}

const copyExtensionHostWorkerFiles = async ({ pathPrefix, commitHash }) => {
  // await Copy.copy({
  //   from: 'packages/extension-host-worker/src',
  //   to: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker/src`,
  // })
  // await Replace.replace({
  //   path: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/parts/ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts`,
  //   occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
  //   replacement: `'${pathPrefix}/${commitHash}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  // })
}

const copyExtensionHostSubWorkerFiles = async ({ commitHash }) => {
  // TODO
  // await Replace.replace({
  //   path: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/parts/Platform/Platform.js`,
  //   occurrence: `/src/extensionHostWorkerMain.js`,
  //   replacement: '/dist/extensionHostWorkerMain.js',
  // })
  // workaround for firefox module worker bug: Error: Dynamic module import is disabled or not supported in this context
}

const copyTestWorkerFiles = async ({ commitHash }) => {
  // await Copy.copy({
  //   from: 'packages/terminal-worker/src',
  //   to: `packages/build/.tmp/dist/${commitHash}/packages/terminal-worker/src`,
  // })
}

const copyStaticFiles = async ({ pathPrefix, ignoreIconTheme, commitHash }) => {
  await Copy.copy({
    from: 'static/config',
    to: `packages/build/.tmp/dist/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `packages/build/.tmp/dist/${commitHash}/static/js`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `packages/build/.tmp/dist/${commitHash}/js`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `packages/build/.tmp/dist/favicon.ico`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `packages/build/.tmp/dist/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/sounds',
    to: `packages/build/.tmp/dist/sounds`,
  })
  await Copy.copyFile({
    from: 'static/manifest.json',
    to: `packages/build/.tmp/dist/${commitHash}/manifest.json`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/dist/${commitHash}/manifest.json`,
    occurrence: '/icons',
    replacement: `${pathPrefix}/${commitHash}/icons`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `packages/build/.tmp/dist/${commitHash}/manifest.json`,
      occurrence: '"start_url": "/"',
      replacement: `"start_url": "${pathPrefix}/"`,
    })
  }
  await Copy.copyFile({
    from: 'static/index.html',
    to: `packages/build/.tmp/dist/index.html`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/dist/index.html`,
    occurrence: '282e2f" />',
    replacement: `282e2f" />
    <meta http-equiv="Content-Security-Policy" content="${StaticContentSecurityPolicy.staticContentSecurityPolicy}">`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `packages/build/.tmp/dist/index.html`,
      occurrence: '/manifest.json',
      replacement: `${pathPrefix}/${commitHash}/manifest.json`,
    })
    await Replace.replace({
      path: `packages/build/.tmp/dist/index.html`,
      occurrence: '</title>',
      replacement: `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`,
    })
  }
  await Replace.replace({
    path: `packages/build/.tmp/dist/index.html`,
    occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
    replacement: `${pathPrefix}/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/dist/index.html`,
    occurrence: '/icons',
    replacement: `${pathPrefix}/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/dist/index.html`,
    occurrence: '/css',
    replacement: `${pathPrefix}/${commitHash}/css`,
  })
  await BundleCss.bundleCss({
    outDir: `packages/build/.tmp/dist/${commitHash}/css`,
    assetDir: `${pathPrefix}/${commitHash}`,
    pathPrefix,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `packages/build/.tmp/dist/${commitHash}/icons`,
  })
  const languageBasics = await getLanguageBasicsNames()
  for (const languageBasic of languageBasics) {
    await Copy.copy({
      from: `extensions/${languageBasic}`,
      to: `packages/build/.tmp/dist/${commitHash}/extensions/${languageBasic}`,
    })
  }
  if (!ignoreIconTheme) {
    await Copy.copy({
      from: 'extensions/builtin.vscode-icons',
      to: `packages/build/.tmp/dist/${commitHash}/extensions/builtin.vscode-icons`,
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
    to: `packages/build/.tmp/dist/${commitHash}/config/languages.json`,
    value: languages,
  })
}

const getAllExtensionsJson = async ({ pathPrefix, commitHash }) => {
  const extensionPath = Path.absolute('extensions')
  const extensions = await readdir(extensionPath)
  const allContent = []
  for (const extension of extensions) {
    const absolutePath = join(extensionPath, extension, 'extension.json')
    const content = await JsonFile.readJson(absolutePath)
    allContent.push({
      ...content,
      path: `${pathPrefix}/${commitHash}/extensions/${extension}`,
    })
  }
  return allContent
}

const bundleExtensionsJson = async ({ commitHash, pathPrefix }) => {
  const allContent = await getAllExtensionsJson({ pathPrefix, commitHash })
  const outPath = Path.absolute(`packages/build/.tmp/dist/${commitHash}/config/extensions.json`)
  await JsonFile.writeJson({ to: outPath, value: allContent })
}

const bundleWebViewFiles = async ({ commitHash, pathPrefix }) => {
  const extensionPath = Path.absolute('extensions')
  const extensionNames = await readdir(extensionPath)
  const extensionPaths = extensionNames.map(getAbsolutePath)
  const existingExtensionPaths = extensionPaths.filter(exists)
  const extensions = await Promise.all(existingExtensionPaths.map(JsonFile.readJson))

  // TODO this might not be needed, only load the webExtensions.json file
  // which include information about all
  // - color themes
  // - languages
  // - webviews
  // - extension activation events
  const getWebViews = (extension) => {
    const getWebView = (webView) => {
      return {
        ...webView,
        remotePath: `${pathPrefix}/${commitHash}/extensions/${extension.id}`,
      }
    }
    const webViews = extension.webViews || []
    return webViews.map(getWebView)
  }
  const webViews = extensions.flatMap(getWebViews)
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/${commitHash}/config/webViews.json`,
    value: webViews,
  })
}

const applyJsOverrides = async ({ pathPrefix, commitHash }) => {}

const addRobotsTxt = async () => {
  await WriteFile.writeFile({
    to: `packages/build/.tmp/dist/robots.txt`,
    content: `User-agent: *
Disallow: /
`,
  })
}

const addVersionFile = async ({ commitHash }) => {
  const commitMessage = await CommitHash.getCommitMessage()
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/version`,
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
      to: `packages/build/.tmp/dist/${commitHash}/themes/${theme}.json`,
    })
  }
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/${commitHash}/config/themes.json`,
    value: themes,
  })
}

const copyWebLangugageFeaturesExtensions = async ({ commitHash, pathPrefix }) => {
  const allExtension = await readdir(Path.absolute('extensions'))
  const extensionsArray = []
  for (const extension of allExtension) {
    try {
      const manifest = await JsonFile.readJson(Path.absolute(`extensions/${extension}/extension.json`))
      extensionsArray.push({
        ...manifest,
        path: `${pathPrefix}/${commitHash}/extensions/${extension}`,
      })
    } catch (error) {
      if (IsEnoentError.isEnoentError(error)) {
        continue
      }
      throw error
    }
  }
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/${commitHash}/config/extensions.json`,
    value: extensionsArray,
  })

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
      to: `packages/build/.tmp/dist/${commitHash}/extensions/${languageFeature}`,
    })
    webExtensions.push({
      ...manifest,
      path: `${pathPrefix}/${commitHash}/extensions/${languageFeature}`,
      isWeb: true,
    })
  }
  // TODO remove this, all extensions are web extensions
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/${commitHash}/config/webExtensions.json`,
    value: webExtensions,
  })
}

const isOther = (extension) => {
  if (extension.startsWith('builtin.language-basics')) {
    return false
  }
  if (extension.startsWith('builtin.language-features')) {
    return false
  }
  return true
}

const copyWebOtherExtensions = async ({ commitHash, pathPrefix }) => {
  const allExtension = await readdir(Path.absolute('extensions'))
  const otherExtensions = allExtension.filter(isOther)
  const webExtensions = []
  for (const extension of otherExtensions) {
    let manifest
    try {
      manifest = await JsonFile.readJson(Path.absolute(`extensions/${extension}/extension.json`))
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
      from: `extensions/${extension}`,
      to: `packages/build/.tmp/dist/${commitHash}/extensions/${extension}`,
    })
    webExtensions.push({
      ...manifest,
      path: `${pathPrefix}/${commitHash}/extensions/${extension}`,
      isWeb: true,
    })
  }
  const existingWebExtensions = await JsonFile.readJson(`packages/build/.tmp/dist/${commitHash}/config/webExtensions.json`)
  await JsonFile.writeJson({
    to: `packages/build/.tmp/dist/${commitHash}/config/webExtensions.json`,
    value: [...existingWebExtensions, ...webExtensions],
  })
}

const copyIconThemes = async ({ commitHash }) => {
  await Copy.copyFile({
    from: 'extensions/builtin.vscode-icons/icon-theme.json',
    to: `packages/build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
    occurrence: '/icons',
    replacement: '/file-icons',
  })
}

const bundleJs = async ({ commitHash, platform, assetDir, version, date, product }) => {
  const toRoot = `packages/build/.tmp/dist/${commitHash}`
  await BundleWorkers.bundleWorkers({
    commitHash,
    platform,
    assetDir,
    product,
    version,
    date,
    toRoot,
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
    to: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker-tests/src`,
    ignore: ['videos'],
  })
  await TranspileFiles.transpileFiles(Path.absolute(`packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker-tests/src`))
  await Copy.copy({
    from: 'packages/extension-host-worker-tests/fixtures',
    to: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`,
  })

  const testFilesRaw = await ReadDir.readDirWithFileTypes('packages/extension-host-worker-tests/src')
  const testFiles = getTestFiles(testFilesRaw)
  await Mkdir.mkdir(`packages/build/.tmp/dist/${commitHash}/tests`)
  for (const testFile of testFiles) {
    await Copy.copyFile({
      from: `packages/build/.tmp/dist/index.html`,
      to: `packages/build/.tmp/dist/tests/${testFile}.html`,
    })
  }
  const testOverviewHtml = generateTestOverviewHtml(testFiles)
  await WriteFile.writeFile({
    to: `packages/build/.tmp/dist/tests/index.html`,
    content: testOverviewHtml,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `packages/build/.tmp/dist/tests/index.html`,
      occurrence: '</title>',
      replacement: `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`,
    })
  }
}

const copyPlaygroundFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: `packages/build/files/playground-source`,
    to: `packages/build/.tmp/dist/${commitHash}/playground`,
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
  await Remove.remove('packages/build/.tmp/dist')
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

  Console.time('copyWebLangugageFeaturesExtensions')
  await copyWebLangugageFeaturesExtensions({ commitHash, pathPrefix })
  Console.timeEnd('copyWebLangugageFeaturesExtensions')

  Console.time('copyWebOtherExtensions')
  await copyWebOtherExtensions({ commitHash, pathPrefix })
  Console.timeEnd('copyWebOtherExtensions')

  if (!ignoreIconTheme) {
    Console.time('copyIconThemes')
    await copyIconThemes({ commitHash })
    Console.timeEnd('copyIconThemes')
  }

  Console.time('bundleLanguageJsonFiles')
  await bundleLanguageJsonFiles({ commitHash, pathPrefix })
  Console.timeEnd('bundleLanguageJsonFiles')

  Console.time('bundleExtensionsJson')
  await bundleExtensionsJson({ commitHash, pathPrefix })
  Console.timeEnd('bundleExtensionsJson')

  Console.time('bundleWebViewFiles')
  await bundleWebViewFiles({ commitHash, pathPrefix })
  Console.timeEnd('bundleWebViewFiles')

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
