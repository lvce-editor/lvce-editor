import { existsSync } from 'node:fs'
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { isAbsolute, join, relative } from 'node:path'
import workers from '../../../../renderer-worker/src/parts/Workers/Workers.json' with { type: 'json' }
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'

const testFileExtensionRegex = /\.(js|ts)$/
const backslashRegex = /\\/g

const staticContentSecurityPolicy = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
  `manifest-src 'self'`,
  `media-src 'self' blob:`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `frame-src 'self' blob:`,
])

const readExtensionManifest = async (path: any): Promise<any> => {
  const json = await JsonFile.readJson(path)
  return { ...json, path }
}

const getThemeName = (dirent: any): any => {
  return dirent.slice('builtin.theme-'.length)
}

const replace = async (path: any, occurrence: any, replacement: any): Promise<any> => {
  const oldContent = await FileSystem.readFile(path)
  if (!oldContent.includes(occurrence)) {
    throw new Error(`failed to replace occurrence ${occurrence} in ${path}: Not found`)
  }
  // @ts-ignore
  const newContent = oldContent.replaceAll(occurrence, replacement)
  await FileSystem.writeFile(path, newContent)
}

const getWorkerById = (id: any): any => {
  const worker = workers.find((item: any) => {
    return item.id === id
  })
  if (!worker) {
    throw new Error(`worker not found: ${id}`)
  }
  return worker
}

const getDistPathFromWorkerPath = (path: any): any => {
  return path.split('/').filter(Boolean)
}

const getWorkerDistPath = (root: any, commitHash: any, id: any): any => {
  const worker = getWorkerById(id)
  return Path.join(root, 'dist', commitHash, ...getDistPathFromWorkerPath(worker.productionPath))
}

/**
 * @param {string} dirent
 */
const isLanguageBasics = (dirent: any): any => {
  return dirent.startsWith('builtin.language-basics')
}

/**
 * @param {string} dirent
 */
const isTheme = (dirent: any): any => {
  return dirent.startsWith('builtin.theme-')
}

/**
 * @param {string} dirent
 */
const isIconTheme = (dirent: any): any => {
  return dirent === 'builtin.vscode-icons'
}

const compare = (a: any, b: any): any => {
  return a.localeCompare(b)
}

const toSorted = (objects: any, compare: any): any => {
  return [...objects].sort(compare)
}

const mergeThemes = (builtinThemes: any, extensionThemes: any): any => {
  const seen: any[] = []
  const merged: any[] = []
  for (const extensionTheme of extensionThemes) {
    seen.push(extensionTheme)
    merged.push(extensionTheme)
  }
  for (const builtinTheme of builtinThemes) {
    if (seen.includes(builtinTheme)) {
      continue
    }
    merged.push(builtinTheme)
  }
  const sorted = toSorted(merged, compare)
  return sorted
}

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent: any): any => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

/**
 * @param {string} root
 */
const clean = async (root: any): Promise<any> => {
  await FileSystem.forceRemove(Path.join(root, 'dist'))
  await FileSystem.mkdir(Path.join(root, 'dist'))
}

/**
 * @param {string} root
 */
const copyStaticFiles = async (root: any, serverStaticPath: any): Promise<any> => {
  await FileSystem.copy(serverStaticPath, Path.join(root, 'dist'))
}

const applyOverridesRendererProcess = async ({ commitHash, pathPrefix, root }: any): Promise<any> => {
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js'),
    'platform = Remote;',
    'platform = Web',
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`,
  )
}

const applyOverrides = async ({ commitHash, pathPrefix, root, serverStaticPath }: any): Promise<any> => {
  const extensionHostWorkerDistPath = getWorkerDistPath(root, commitHash, 'extensionHostWorker')
  await applyOverridesRendererProcess({ commitHash, pathPrefix, root })
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    'platform = Remote;',
    'platform = Web$1;',
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`,
  )
  await replace(
    extensionHostWorkerDistPath,
    `return \`\${assetDir}/extensions/builtin.theme-\${colorThemeId}/color-theme.json\``,
    `return \`\${assetDir}/themes/\${colorThemeId}.json\``,
  )
  await replace(extensionHostWorkerDistPath, `/${commitHash}`, `${pathPrefix}/${commitHash}`)
  await replace(extensionHostWorkerDistPath, `const platform = Remote`, `const platform = Web`)
  // await replace(
  //   Path.join(root, 'dist', commitHash, 'packages', 'extension-host-worker', 'dist', 'extensionHostWorkerMain.js'),
  //   `return \`\${assetDir}/extensions/builtin.\${iconThemeId}/icon-theme.json\``,
  //   `return \`\${assetDir}/icon-themes/\${iconThemeId}.json\``,
  // )

  const extensionDirents = await FileSystem.readDir(Path.join(serverStaticPath, commitHash, 'extensions'))

  const languageBasicsDirents = extensionDirents.filter(isLanguageBasics)
  const themeDirents = extensionDirents.filter(isTheme)
  const iconThemeDirents = extensionDirents.filter(isIconTheme)

  const getLanguages = (extension: any): any => {
    const languages: any[] = []
    for (const language of extension.languages || []) {
      languages.push({
        ...language,
        tokenize: `${pathPrefix}/${commitHash}/extensions/${extension.id}/${language.tokenize}`,
      })
    }
    return languages
  }

  const getWebViews = (extension: any): any => {
    const webViews: any[] = []
    for (const webView of extension.webViews || []) {
      webViews.push({
        ...webView,
        path: `${pathPrefix}/${commitHash}/extensions/${webView.path}`,
        remotePath: `${pathPrefix}/${commitHash}/extensions/${extension.id}`,
      })
    }
    return webViews
  }

  /**
   * @param {string} dirent
   */
  const getManifestPath = (dirent: any): any => {
    return Path.join(serverStaticPath, commitHash, 'extensions', dirent, 'extension.json')
  }

  const manifestPaths = languageBasicsDirents.map(getManifestPath)
  const manifests = await Promise.all(manifestPaths.map(readExtensionManifest))
  const languages = manifests.flatMap(getLanguages)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'languages.json'), languages)

  const webViews = manifests.flatMap(getWebViews)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'webViews.json'), webViews)

  for (const languageBasicsDirent of languageBasicsDirents) {
    await FileSystem.copy(
      Path.join(serverStaticPath, commitHash, 'extensions', languageBasicsDirent),
      Path.join(root, 'dist', commitHash, 'extensions', languageBasicsDirent),
    )
  }

  for (const themeDirent of themeDirents) {
    const themeId = getThemeName(themeDirent)
    await FileSystem.copy(
      Path.join(serverStaticPath, commitHash, 'extensions', themeDirent, 'color-theme.json'),
      Path.join(root, 'dist', commitHash, 'themes', `${themeId}.json`),
    )
  }

  const themeIds = mergeThemes(themeDirents.map(getThemeName), [])
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'), themeIds)

  for (const iconThemeDirent of iconThemeDirents) {
    const iconThemeId = iconThemeDirent.slice('builtin.'.length)
    await FileSystem.copy(
      Path.join(serverStaticPath, commitHash, 'extensions', iconThemeDirent, 'icon-theme.json'),
      Path.join(root, 'dist', commitHash, 'icon-themes', `${iconThemeId}.json`),
    )
  }
  const indexHtmlPath = Path.join(root, 'dist', 'index.html')
  await replace(indexHtmlPath, `/${commitHash}`, `${pathPrefix}/${commitHash}`)

  await replace(
    indexHtmlPath,
    '#282e2f" />',
    `#282e2f" />
    <meta http-equiv="Content-Security-Policy" content="${staticContentSecurityPolicy}">`,
  )

  if (pathPrefix) {
    await replace(
      indexHtmlPath,
      '</title>',
      `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`,
    )
  } else {
    await replace(
      indexHtmlPath,
      '</title>',
      `</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">`,
    )
  }
  if (pathPrefix) {
    await replace(Path.join(root, 'dist', commitHash, 'manifest.json'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
    await replace(Path.join(root, 'dist', commitHash, 'manifest.json'), `"start_url": "/"`, `"start_url": "${pathPrefix}"`)
    await replace(Path.join(root, 'dist', commitHash, 'css', 'App.css'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
  }
}

const addExtensionSeo = async ({ commitHash, description, name, root }: any): Promise<any> => {
  await replace(Path.join(root, 'dist', 'index.html'), '<title>Lvce Editor</title>', `<title>${name}</title>`)
  await replace(Path.join(root, 'dist', commitHash, 'manifest.json'), `"name": "Code Editor Web - OSS"`, `"name": "${name}"`)
  await replace(Path.join(root, 'dist', commitHash, 'manifest.json'), `"short_name": "Web - OSS"`, `"short_name": "${name}"`)
  await replace(Path.join(root, 'dist', commitHash, 'manifest.json'), `"description": "Web Code Editor."`, `"description": "${description}"`)
  await replace(
    Path.join(root, 'dist', 'index.html'),
    '<meta name="description" content="VS Code inspired text editor that mostly runs in a webworker." />',
    `<meta name="description" content="${description}" />`,
  )
}

const getId = (object: any): any => {
  return object.id
}

const addExtensionThemes = async ({ commitHash, extensionJson, extensionPath, root }: any): Promise<any> => {
  const colorThemes = extensionJson.colorThemes || []
  if (colorThemes.length === 0) {
    return
  }
  for (const colorTheme of colorThemes) {
    const { id, path } = colorTheme
    const extensionId = `builtin.theme-${id}`
    await FileSystem.forceRemove(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
    await FileSystem.mkdir(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
    await FileSystem.copy(Path.join(extensionPath, path), Path.join(root, 'dist', commitHash, 'themes', `${id}.json`))
    await replace(
      Path.join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
      `"workbench.colorTheme": "slime"`,
      `"workbench.colorTheme": "${id}"`,
    )
    await FileSystem.copyFile(Path.join(root, 'README.md'), Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'README.md'))
    await FileSystem.copyFile(
      Path.join(extensionPath, 'extension.json'),
      Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'extension.json'),
    )
    await FileSystem.copyFile(
      Path.join(extensionPath, 'color-theme.json'),
      Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'color-theme.json'),
    )
  }
  const themesJson = await JsonFile.readJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'))
  const ids = colorThemes.map(getId)
  const mergedThemes = mergeThemes(themesJson, ids)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'), mergedThemes)
}

const compareId = (a: any, b: any): any => {
  return a.id.localeCompare(b.id)
}

const mergeLanguages = (languages: any, extensionLanguages: any): any => {
  const seen: any[] = []
  const merged: any[] = []
  for (const language of extensionLanguages) {
    seen.push(language.id)
    merged.push(language)
  }
  for (const language of languages) {
    if (seen.includes(language.id)) {
      continue
    }
    merged.push(language)
  }
  merged.sort(compareId)
  return merged
}

const toPlaygroundFile = (file: any): any => {
  return `/playground/${file}`
}

const addExtensionLanguages = async ({ commitHash, extensionJson, extensionPath, pathPrefix, root }: any): Promise<any> => {
  const languages = extensionJson.languages || []
  if (languages.length === 0) {
    return
  }
  const extensionId = extensionJson.id
  await FileSystem.forceRemove(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
  await FileSystem.mkdir(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
  await FileSystem.copyFile(Path.join(root, 'README.md'), Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'README.md'))
  for (const file of ['src', 'data', 'extension.json']) {
    if (await FileSystem.exists(Path.join(extensionPath, file))) {
      await FileSystem.copy(Path.join(extensionPath, file), Path.join(root, 'dist', commitHash, 'extensions', extensionId, file))
    }
  }
  const extensionLanguages: any[] = []
  for (const language of languages) {
    if (!language.tokenize) {
      continue
    }
    extensionLanguages.push({
      ...language,
      tokenize: `${pathPrefix}/${commitHash}/extensions/${extensionId}/${language.tokenize}`,
    })
  }
  const builtinLanguages = await JsonFile.readJson(Path.join(root, 'dist', commitHash, 'config', 'languages.json'))
  const mergedLanguages = mergeLanguages(builtinLanguages, extensionLanguages)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'languages.json'), mergedLanguages)
  if (await FileSystem.exists(Path.join(extensionPath, 'test', 'cases'))) {
    await FileSystem.forceRemove(Path.join(root, 'dist', commitHash, 'playground'))
    await FileSystem.copy(Path.join(extensionPath, 'test', 'cases'), Path.join(root, 'dist', commitHash, 'playground'))
    const testFiles = await FileSystem.readDir(Path.join(extensionPath, 'test', 'cases'))
    const fileMap = testFiles.map(toPlaygroundFile)
    await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'fileMap.json'), fileMap)
  }
}

export const mergeExtensionManifests = (manifests: any, extraExtensions: any): any => {
  const replacements = Object.create(null)
  for (const extension of extraExtensions) {
    replacements[extension.id] = extension
  }
  const used = Object.create(null)
  const merged = manifests.map((manifest: any) => {
    const replacement = replacements[manifest.id]
    if (replacement) {
      used[manifest.id] = true
      return replacement
    }
    return manifest
  })
  for (const extension of extraExtensions) {
    if (used[extension.id]) {
      continue
    }
    merged.push(extension)
  }
  return merged
}

const updateExtensionsJson = async ({ commitHash, extraExtensions, pathPrefix, root }: any): Promise<any> => {
  const dirents = await FileSystem.readDir(Path.join(root, 'dist', commitHash, 'extensions'))
  const manifests = await Promise.all(
    dirents.map(async (dirent: any) => {
      const json = await JsonFile.readJson(Path.join(root, 'dist', commitHash, 'extensions', dirent, 'extension.json'))
      const webExtensionPath = `${pathPrefix}/${commitHash}/extensions/${dirent}`
      return {
        ...json,
        path: webExtensionPath,
      }
    }),
  )
  const localExtensions = extraExtensions.map((extension: any) => {
    return {
      ...extension,
      path: `${pathPrefix}/${commitHash}/extensions/${extension.id}`,
    }
  })
  const newExtensions = mergeExtensionManifests(manifests, localExtensions)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'extensions.json'), newExtensions)
}

const addExtensionWebExtension = async ({
  commitHash,
  extensionJson,
  extensionPath,
  pathPrefix,
  root,
  useSimpleWebExtensionFile,
}: any): Promise<any> => {
  await updateExtensionsJson({ commitHash, extraExtensions: [extensionJson], pathPrefix, root })

  if (!extensionJson.browser) {
    return
  }
  const webExtensionPath = `${pathPrefix}/${commitHash}/extensions/${extensionJson.id}`
  if (useSimpleWebExtensionFile) {
    const webExtensions = [webExtensionPath]
    await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'), webExtensions)
    return
  }
  const webExtensions = [
    {
      ...extensionJson,
      isWeb: true,
      path: webExtensionPath,
    },
  ]
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'), webExtensions)
  await FileSystem.forceRemove(Path.join(root, 'dist', commitHash, 'extensions', extensionJson.id))
  for (const dirent of ['src', 'extension.json']) {
    await FileSystem.copy(Path.join(extensionPath, dirent), Path.join(root, 'dist', commitHash, 'extensions', extensionJson.id, dirent))
  }
}

const addExtension = async ({ commitHash, extensionPath, pathPrefix, root, useSimpleWebExtensionFile }: any): Promise<any> => {
  const extensionJson = await readExtensionManifest(Path.join(extensionPath, 'extension.json'))
  const name = extensionJson.name || extensionJson.id || ''
  const description = extensionJson.description || ''
  await addExtensionSeo({
    commitHash,
    description,
    name,
    root,
  })
  await addExtensionThemes({
    commitHash,
    extensionJson,
    extensionPath,
    root,
  })
  await addExtensionLanguages({
    commitHash,
    extensionJson,
    extensionPath,
    pathPrefix,
    root,
  })

  await addExtensionWebExtension({
    commitHash,
    extensionJson,
    extensionPath,
    pathPrefix,
    root,
    useSimpleWebExtensionFile,
  })
}

const generateTestOverviewHtml = (dirents: any): any => {
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

const getName = (name: any): any => {
  return name.replace(testFileExtensionRegex, '')
}
const isTestFile = (file: any): any => {
  if (file.startsWith('_')) {
    return false
  }
  return file.endsWith('.js') || file.endsWith('.ts')
}

const getTestFiles = (testFilesRaw: any): any => {
  return testFilesRaw.filter(isTestFile).map(getName)
}

export const transpileFile = (content: any): any => {
  return stripTypeScriptTypes(content)
}

const transpileFiles = async (folder: any): Promise<any> => {
  const dirents = await readdir(folder)
  for (const dirent of dirents) {
    if (dirent.endsWith('.ts')) {
      const content = await readFile(join(folder, dirent), 'utf-8')
      const js = transpileFile(content)
      await writeFile(join(folder, dirent.slice(0, -2) + 'js'), js)
    }
  }
  for (const dirent of dirents) {
    if (dirent.endsWith('.ts')) {
      await rm(join(folder, dirent))
    }
  }
}

export const createFilemap = async (fixturesPath: any): Promise<any> => {
  const filemap: Record<string, any> = {}

  const dirents = await readdir(fixturesPath, { recursive: true, withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isFile()) {
      // Calculate relative path by removing the fixturesPath prefix from parentPath
      const fullPath = join(dirent.parentPath, dirent.name)
      let relativeFilePath
      if (dirent.parentPath === fixturesPath) {
        relativeFilePath = dirent.name
      } else {
        // Manually calculate relative path for cross-platform compatibility
        // Remove the fixturesPath prefix from parentPath and normalize separators
        const normalizedFixturesPath = fixturesPath.replace(backslashRegex, '/')
        const normalizedParentPath = dirent.parentPath.replace(backslashRegex, '/')
        const relativeDir = normalizedParentPath.replace(normalizedFixturesPath + '/', '')
        relativeFilePath = join(relativeDir, dirent.name)
      }
      const content = await FileSystem.readFile(fullPath)
      filemap[relativeFilePath] = content
    }
  }

  return filemap
}

export const createFilemapsPerFixture = async (fixturesPath: any): Promise<any> => {
  const dirents = await readdir(fixturesPath, { withFileTypes: true })

  const fixtureDirectories = dirents.filter((dirent: any) => dirent.isDirectory())

  // Create filemaps in parallel
  await Promise.all(
    fixtureDirectories.map(async (dirent: any) => {
      const fixturePath = join(fixturesPath, dirent.name)
      const filemap = await createFilemap(fixturePath)

      // Create fileMap.json in the fixture directory
      const fileMapPath = join(fixturePath, 'fileMap.json')
      await FileSystem.writeFile(fileMapPath, JSON.stringify(filemap, null, 2))
    }),
  )
}

const addTestFiles = async ({ commitHash, pathPrefix, root, testPath }: any): Promise<any> => {
  const testRoot = isAbsolute(testPath) ? testPath : join(root, testPath)
  await FileSystem.copy(`${testRoot}/src`, `${root}/dist/${commitHash}/packages/extension-host-worker-tests/src`)
  if (existsSync(`${testRoot}/fixtures`)) {
    await FileSystem.copy(`${testRoot}/fixtures`, `${root}/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`)

    // Create fileMap.json for each fixture directory
    await createFilemapsPerFixture(`${root}/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`)
  }
  const distDirentsPath = `${root}/dist/${commitHash}/packages/extension-host-worker-tests/src`
  await transpileFiles(distDirentsPath)

  const testFilesRaw = await FileSystem.readDir(`${testRoot}/src`)
  const testFiles = getTestFiles(testFilesRaw)
  const hashTestsPath = `${root}/dist/${commitHash}/tests`
  const rootTestsPath = `${root}/dist/tests`
  await FileSystem.mkdir(hashTestsPath)
  await FileSystem.mkdir(rootTestsPath)
  await FileSystem.copyFile(`${root}/dist/index.html`, `${hashTestsPath}/_all.html`)
  await FileSystem.copyFile(`${root}/dist/index.html`, `${rootTestsPath}/_all.html`)
  for (const testFile of testFiles) {
    await FileSystem.copyFile(`${root}/dist/index.html`, `${hashTestsPath}/${testFile}.html`)
    await FileSystem.copyFile(`${root}/dist/index.html`, `${rootTestsPath}/${testFile}.html`)
  }
  const testOverviewHtml = generateTestOverviewHtml(testFiles)
  await FileSystem.writeFile(`${hashTestsPath}/index.html`, testOverviewHtml)
  await FileSystem.writeFile(`${rootTestsPath}/index.html`, testOverviewHtml)
}

const resolveServerStaticPath = (root: any): any => {
  const guessOne = Path.join(root, 'node_modules', '@lvce-editor', 'server', 'static')
  if (existsSync(guessOne)) {
    return guessOne
  }
  const guessTwo = Path.join(root, 'packages', 'build', 'node_modules', '@lvce-editor', 'server', 'static')
  if (existsSync(guessTwo)) {
    return guessTwo
  }
  const guessThree = Path.join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'server', 'static')
  if (existsSync(guessThree)) {
    return guessThree
  }
  const guessFour = Path.join(root, 'packages', 'build', 'node_modules', '@lvce-editor', 'static-server', 'static')
  if (existsSync(guessFour)) {
    return guessFour
  }
  const guessFive = Path.join(root, 'node_modules', '@lvce-editor', 'static-server', 'static')
  if (existsSync(guessFive)) {
    return guessFive
  }
  const guessSix = Path.join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'static-server', 'static')
  if (existsSync(guessSix)) {
    return guessSix
  }
  throw new Error(`server static path not found`)
}

const toArray = (value: any): any => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

const getExtensionPaths = (extensionPath: any, extensionPaths: any): any => {
  const seen = Object.create(null)
  const allExtensionPaths: any[] = []
  for (const path of [...toArray(extensionPath), ...toArray(extensionPaths)]) {
    if (!path || seen[path]) {
      continue
    }
    seen[path] = true
    allExtensionPaths.push(path)
  }
  return allExtensionPaths
}

/**
 *
 * @param {{root:string, pathPrefix:string , extensionPath:string, extensionPaths?:string[], testPath:string, useSimpleWebExtensionFile?:boolean, serverStaticPath?:string }} param0
 */
export const exportStatic = async ({
  extensionPath,
  extensionPaths,
  pathPrefix,
  root,
  serverStaticPath,
  testPath,
  useSimpleWebExtensionFile,
}: any): Promise<any> => {
  if (!existsSync(root)) {
    throw new Error(`root path does not exist: ${root}`)
  }
  const allExtensionPaths = getExtensionPaths(extensionPath, extensionPaths)
  for (const extensionPath of allExtensionPaths) {
    if (!existsSync(extensionPath)) {
      throw new Error(`extension path does not exist: ${extensionPath}`)
    }
  }
  if (!serverStaticPath) {
    serverStaticPath = resolveServerStaticPath(root)
  }
  if (pathPrefix === 'auto') {
    if (allExtensionPaths.length === 0) {
      throw new Error(`extension path is required when path prefix is auto`)
    }
    const [extensionPath] = allExtensionPaths
    const extensionJson = await readExtensionManifest(Path.join(extensionPath, 'extension.json'))
    const { id } = extensionJson
    const [author, name] = id.split('.')
    pathPrefix = `/${name}`
  }
  const dirents = await FileSystem.readDir(serverStaticPath)
  const commitHash = dirents.find(isCommitHash) || ''

  console.time('clean')
  await clean(root)
  console.timeEnd('clean')

  console.time('copyStaticFiles')
  await copyStaticFiles(root, serverStaticPath)
  console.timeEnd('copyStaticFiles')

  console.time('applyOverrides')
  await applyOverrides({
    commitHash,
    pathPrefix,
    root,
    serverStaticPath,
  })
  console.timeEnd('applyOverrides')

  await updateExtensionsJson({ commitHash, extraExtensions: [], pathPrefix, root })

  for (const extensionPath of allExtensionPaths) {
    console.time('addExtension')
    await addExtension({
      commitHash,
      extensionPath,
      pathPrefix,
      root,
      useSimpleWebExtensionFile,
    })
    console.timeEnd('addExtension')
  }

  if (testPath) {
    console.time('addTestFiles')
    await addTestFiles({
      commitHash,
      pathPrefix,
      root,
      testPath,
    })
    console.timeEnd('addTestFiles')
  }
  return {
    commitHash,
  }
}
