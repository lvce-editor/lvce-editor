import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as Mkdir from '../Mkdir/Mkdir.js'

const copyJs = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/dist/${commitHash}/packages/renderer-process/src`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src`,
  })
  await Copy.copy({
    from: 'packages/extension-host-worker/src',
    to: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src`,
  })
}

const copyStaticFiles = async ({ pathPrefix }) => {
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
    to: `build/.tmp/dist/fonts`,
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
    occurrence: '/config',
    replacement: `${pathPrefix}/${commitHash}/config`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `build/.tmp/dist/index.html`,
      occurrence: '/fonts/',
      replacement: `${pathPrefix}/fonts/`,
    })
    await Replace.replace({
      path: `build/.tmp/dist/index.html`,
      occurrence: '/manifest.json',
      replacement: `${pathPrefix}/manifest.json`,
    })
  }
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
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/IconTheme/IconTheme.js`,
    occurrence: `return \`\${extensionPath}\${value}\``,
    replacement: `return \`/${pathPrefix}/file-icons/\${value.slice(7)}\``,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '</head>',
    replacement: `  <link rel="preload" href="${pathPrefix}/${commitHash}/config/defaultSettings.json" as="fetch" crossorigin>
    <link rel="preload" href="${pathPrefix}/${commitHash}/config/languages.json" as="fetch" crossorigin>
    <link rel="preload" href="${pathPrefix}/${commitHash}/themes/slime.json" as="fetch" crossorigin>
    <link rel="preload" href="${pathPrefix}/${commitHash}/icon-themes/vscode-icons.json" as="fetch" crossorigin>
  </head>`,
  })
  if (pathPrefix) {
    await Replace.replace({
      path: `build/.tmp/dist/index.html`,
      occurrence: '</title>',
      replacement: `</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">`,
    })
  }

  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '</body>',
    replacement: `  <script>
// set background colors to avoid white flash on firefox
const px = value => {
  return \`\${value}px\`
}

const getLayout = () => {
  const layoutItem = localStorage.getItem('layout')
  if(!layoutItem){
    return undefined
  }
  try {
    return JSON.parse(layoutItem)
  } catch {
    return undefined
  }
}

const preload = () => {
  const layout = getLayout()
  if(!layout){
    return
  }

  const $ActivityBar = document.createElement('div')
  $ActivityBar.style.left = px(layout.activityBarLeft)
  $ActivityBar.style.top = px(layout.activityBarTop)
  $ActivityBar.style.width = px(layout.activityBarWidth)
  $ActivityBar.style.height = px(layout.activityBarHeight)
  $ActivityBar.style.background = 'rgb(41, 48, 48)'
  $ActivityBar.style.position = 'fixed'

  const $Main = document.createElement('div')
  $Main.style.left = px(layout.mainLeft)
  $Main.style.top = px(layout.mainTop)
  $Main.style.width = px(layout.mainWidth)
  $Main.style.height = px(layout.mainHeight)
  $Main.style.background = '#1e2324'
  $Main.style.position = 'fixed'

  const $TitleBar = document.createElement('div')
  $TitleBar.style.top = px(layout.titleBarTop)
  $TitleBar.style.left = px(layout.titleBarLeft)
  $TitleBar.style.width = px(layout.titleBarWidth)
  $TitleBar.style.height = px(layout.titleBarHeight)
  $TitleBar.style.background = 'rgb(40, 46, 47)'
  $TitleBar.style.position = 'fixed'

  const $StatusBar = document.createElement('div')
  $StatusBar.style.top = px(layout.statusBarTop)
  $StatusBar.style.left = px(layout.statusBarLeft)
  $StatusBar.style.width = px(layout.statusBarWidth)
  $StatusBar.style.height = px(layout.statusBarHeight)
  $StatusBar.style.background = 'black'
  $StatusBar.style.position = 'fixed'

  const $SideBar = document.createElement('div')
  $SideBar.style.top = px(layout.sideBarTop)
  $SideBar.style.left = px(layout.sideBarLeft)
  $SideBar.style.width = px(layout.sideBarWidth)
  $SideBar.style.height = px(layout.sideBarHeight)
  $SideBar.style.background = '#1b2020'
  $SideBar.style.position = 'fixed'

  const $Preload = document.createElement('div')
  $Preload.style.position = 'fixed'
  $Preload.style.zIndex=1
  $Preload.append($TitleBar, $Main, $SideBar, $ActivityBar, $StatusBar)

  document.body.append($Preload)

  window.addEventListener('load', () => {
    requestIdleCallback(()=>{
      $Preload.remove()
    })
  })
}

preload()
    </script>
  </body>`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/packages/renderer-process/src/rendererProcessMain.js',
    replacement: `${pathPrefix}/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/index.html`,
    occurrence: '/packages/renderer-worker/src/rendererWorkerMain.js',
    replacement: `${pathPrefix}/${commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js`,
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
  await Copy.copy({
    from: 'extensions/builtin.vscode-icons/icons',
    to: `build/.tmp/dist/file-icons`,
  })
  await BundleCss.bundleCss({
    to: `build/.tmp/dist/${commitHash}/css/App.css`,
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/css/App.css`,
    occurrence: `url(/icons/`,
    replacement: `url(/${pathPrefix}${commitHash}/icons/`,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `build/.tmp/dist/${commitHash}/icons`,
  })
  const languageBasics = await getLanguageBasicsNames()
  for (const languageBasic of languageBasics) {
    await Copy.copy({
      from: `extensions/${languageBasic}/src`,
      to: `build/.tmp/dist/${commitHash}/extensions/${languageBasic}/src/`,
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
  const extensions = await Promise.all(
    existingExtensionPaths.map(JsonFile.readJson)
  )
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

const applyJsOverrides = async ({ pathPrefix, commitHash }) => {
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
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js`,
    occurrence: `const platform = getPlatform() `,
    replacement: "const platform = 'web'",
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `/src/rendererWorkerMain.js`,
    replacement: '/dist/rendererWorkerMain.js',
  })
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: '/packages/extension-host-worker-tests',
    replacement: `/${commitHash}/packages/extension-host-worker-tests`,
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
    path: `build/.tmp/dist/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence:
      '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
    replacement: `${pathPrefix}/${commitHash}/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
  })
  // workaround for firefox module worker bug: Error: Dynamic module import is disabled or not supported in this context
  await Replace.replace({
    path: `build/.tmp/dist/${commitHash}/packages/extension-host-worker/src/extensionHostWorkerMain.js`,
    occurrence: `main()`,
    replacement: `main()\n\nexport const x = 42`,
  })
}

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
  const netlifyHeaders = TEMPLATE_NETLIFY_HEADERS.replaceAll(
    'COMMIT_HASH',
    commitHash
  )
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

const copyIconThemes = async ({ commitHash }) => {
  await Copy.copyFile({
    from: 'extensions/builtin.vscode-icons/icon-theme.json',
    to: `build/.tmp/dist/${commitHash}/icon-themes/vscode-icons.json`,
  })
}

const bundleJs = async ({ commitHash }) => {
  await BundleJs.bundleJs({
    cwd: Path.absolute(
      `build/.tmp/dist/${commitHash}/packages/renderer-process`
    ),
    from: 'src/rendererProcessMain.js',
    platform: 'web',
    codeSplitting: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(
      `build/.tmp/dist/${commitHash}/packages/renderer-worker`
    ),
    from: 'src/rendererWorkerMain.js',
    platform: 'webworker',
    codeSplitting: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(
      `build/.tmp/dist/${commitHash}/packages/extension-host-worker`
    ),
    from: 'src/extensionHostWorkerMain.js',
    platform: 'webworker',
    codeSplitting: false,
  })
}

const generateTestOverviewHtml = (dirents) => {
  const pre = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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

  const testFilesRaw = await ReadDir.readDir(
    'packages/extension-host-worker-tests/src'
  )
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
}

export const build = async () => {
  const commitHash = await CommitHash.getCommitHash()
  const pathPrefix = Platform.getPathPrefix()

  Console.time('clean')
  await Remove.remove('build/.tmp/dist')
  Console.timeEnd('clean')

  Console.time('copyJs')
  await copyJs({ commitHash })
  Console.timeEnd('copyJs')

  Console.time('copyStaticFiles')
  await copyStaticFiles({ pathPrefix })
  Console.timeEnd('copyStaticFiles')

  Console.time('applyJsOverrides')
  await applyJsOverrides({ pathPrefix, commitHash })
  Console.timeEnd('applyJsOverrides')

  Console.time('bundleJs')
  await bundleJs({ commitHash })
  Console.timeEnd('bundleJs')

  Console.time('copyColorThemes')
  await copyColorThemes({ commitHash })
  Console.timeEnd('copyColorThemes')

  Console.time('copyIconThemes')
  await copyIconThemes({ commitHash })
  Console.timeEnd('copyIconThemes')

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

  // console.time('removeUnusedThings')
  // await removeUnusedThings()
  // console.timeEnd('removeUnusedThings')
}
