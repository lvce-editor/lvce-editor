import * as FileSystem from '../FileSystem/FileSystem.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'

// TODO
// - implement this for syntax highlighting projects
// - implement this for language features web extensions

const readExtensionManifest = async (path) => {
  const json = await JsonFile.readJson(path)
  return { ...json, path }
}

const getThemeName = (dirent) => {
  return dirent.slice('builtin.theme-'.length)
}

const replace = async (path, occurrence, replacement) => {
  const oldContent = await FileSystem.readFile(path)
  if (!oldContent.includes(occurrence)) {
    throw new Error(`failed to replace occurrence ${occurrence} in ${path}: Not found`)
  }
  // @ts-ignore
  const newContent = oldContent.replaceAll(occurrence, replacement)
  await FileSystem.writeFile(path, newContent)
}

/**
 * @param {string} dirent
 */
const isLanguageBasics = (dirent) => {
  return dirent.startsWith('builtin.language-basics')
}

/**
 * @param {string} dirent
 */
const isTheme = (dirent) => {
  return dirent.startsWith('builtin.theme-')
}

/**
 * @param {string} dirent
 */
const isIconTheme = (dirent) => {
  return dirent === 'builtin.vscode-icons'
}

const compare = (a, b) => {
  return a.localeCompare(b)
}

const toSorted = (objects, compare) => {
  return [...objects].sort(compare)
}

const mergeThemes = (builtinThemes, extensionThemes) => {
  const seen = []
  const merged = []
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
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

/**
 * @param {string} root
 */
const clean = async (root) => {
  await FileSystem.remove(Path.join(root, 'dist'))
  await FileSystem.mkdir(Path.join(root, 'dist'))
}

/**
 * @param {string} root
 */
const copyStaticFiles = async (root, commitHash) => {
  await FileSystem.copy(Path.join(root, 'node_modules', '@lvce-editor', 'server', 'static'), Path.join(root, 'dist'))
}

const applyOverrides = async ({ root, commitHash, pathPrefix }) => {
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js'),
    'platform = getPlatform();',
    'platform = "web"'
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js'),
    `return "/${commitHash}";`,
    `return "${pathPrefix}/${commitHash}";`
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    'platform = getPlatform();',
    'platform = "web"'
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `platform2 = "remote";`,
    'platform2 = "web";'
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `return "/${commitHash}";`,
    `return "${pathPrefix}/${commitHash}";`
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `return \`\${assetDir}/extensions/builtin.theme-\${colorThemeId}/color-theme.json\``,
    `return \`\${assetDir}/themes/\${colorThemeId}.json\``
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'extension-host-worker', 'dist', 'extensionHostWorkerMain.js'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `getIconThemeUrl = (iconThemeId) => {
      return \`/extensions/builtin.\${iconThemeId}/icon-theme.json\`;
    }`,
    `getIconThemeUrl = (iconThemeId) => {
      const assetDir = getAssetDir()
      return \`\${assetDir}/icon-themes/\${iconThemeId}.json\`
    }`
  )
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `return \`\${extensionPath}\${value}\``,
    `return \`${pathPrefix}/${commitHash}/file-icons/\${value.slice(7)}\``
  )

  // workaround for firefox bug
  await replace(
    Path.join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js'),
    `//# sourceMappingURL`,
    `export {}
//# sourceMappingURL`
  )
  const extensionDirents = await FileSystem.readDir(Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions'))

  const languageBasicsDirents = extensionDirents.filter(isLanguageBasics)
  const themeDirents = extensionDirents.filter(isTheme)
  const iconThemeDirents = extensionDirents.filter(isIconTheme)

  const getLanguages = (extension) => {
    const languages = []
    for (const language of extension.languages || []) {
      languages.push({
        ...language,
        tokenize: `${pathPrefix}/${commitHash}/extensions/${extension.id}/${language.tokenize}`,
      })
    }
    return languages
  }

  /**
   * @param {string} dirent
   */
  const getManifestPath = (dirent) => {
    return Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions', dirent, 'extension.json')
  }

  const manifestPaths = languageBasicsDirents.map(getManifestPath)
  const manifests = await Promise.all(manifestPaths.map(readExtensionManifest))
  const languages = manifests.flatMap(getLanguages)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'languages.json'), languages)

  for (const languageBasicsDirent of languageBasicsDirents) {
    await FileSystem.copy(
      Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions', languageBasicsDirent),
      Path.join(root, 'dist', commitHash, 'extensions', languageBasicsDirent)
    )
  }

  for (const themeDirent of themeDirents) {
    const themeId = getThemeName(themeDirent)
    await FileSystem.copy(
      Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions', themeDirent, 'color-theme.json'),
      Path.join(root, 'dist', commitHash, 'themes', `${themeId}.json`)
    )
  }

  const themeIds = mergeThemes(themeDirents.map(getThemeName), [])
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'), themeIds)

  for (const iconThemeDirent of iconThemeDirents) {
    const iconThemeId = iconThemeDirent.slice('builtin.'.length)
    await FileSystem.copy(
      Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions', iconThemeDirent, 'icon-theme.json'),
      Path.join(root, 'dist', commitHash, 'icon-themes', `${iconThemeId}.json`)
    )
    await FileSystem.copy(
      Path.join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions', iconThemeDirent, 'icons'),
      Path.join(root, 'dist', commitHash, 'file-icons')
    )
  }
  await replace(Path.join(root, 'dist', 'index.html'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
  await replace(Path.join(root, 'dist', 'index.html'), `/manifest.json`, `${pathPrefix}/manifest.json`)

  if (pathPrefix) {
    await replace(
      Path.join(root, 'dist', 'index.html'),
      '</title>',
      `</title>
    <link rel="shortcut icon" type="image/x-icon" href="${pathPrefix}/favicon.ico">`
    )
  } else {
    await replace(
      Path.join(root, 'dist', 'index.html'),
      '</title>',
      `</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">`
    )
  }
  if (pathPrefix) {
    await replace(Path.join(root, 'dist', 'manifest.json'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
    await replace(Path.join(root, 'dist', 'manifest.json'), `"start_url": "/"`, `"start_url": "${pathPrefix}"`)
    await replace(Path.join(root, 'dist', commitHash, 'css', 'App.css'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
    await replace(Path.join(root, 'dist', commitHash, 'css', 'parts', 'EditorTabs.css'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
    await replace(Path.join(root, 'dist', commitHash, 'css', 'parts', 'ViewletTitleBarButtons.css'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
    await replace(Path.join(root, 'dist', commitHash, 'css', 'parts', 'ViewletTitleBarIcon.css'), `/${commitHash}`, `${pathPrefix}/${commitHash}`)
  }
}

const addExtensionSeo = async ({ root, name, description }) => {
  await replace(Path.join(root, 'dist', 'index.html'), '<title>Code Editor</title>', `<title>${name}</title>`)
  await replace(Path.join(root, 'dist', 'manifest.json'), `"name": "Code Editor Web - OSS"`, `"name": "${name}"`)
  await replace(Path.join(root, 'dist', 'manifest.json'), `"short_name": "Web - OSS"`, `"short_name": "${name}"`)
  await replace(Path.join(root, 'dist', 'manifest.json'), `"description": "Web Code Editor."`, `"description": "${description}"`)
  await replace(
    Path.join(root, 'dist', 'index.html'),
    '<meta name="description" content="Online Code Editor" />',
    `<meta name="description" content="${description}" />`
  )
}

const getId = (object) => {
  return object.id
}

const addExtensionThemes = async ({ root, extensionPath, extensionJson, commitHash }) => {
  const colorThemes = extensionJson.colorThemes || []
  if (colorThemes.length === 0) {
    return
  }
  for (const colorTheme of colorThemes) {
    const { id, path } = colorTheme
    await FileSystem.mkdir(Path.join(root, 'dist', commitHash, 'extensions', `builtin.theme-${id}`))
    await FileSystem.copy(Path.join(extensionPath, path), Path.join(root, 'dist', commitHash, 'themes', `${id}.json`))
    await replace(
      Path.join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
      `"workbench.colorTheme": "slime"`,
      `"workbench.colorTheme": "${id}"`
    )
    await FileSystem.copyFile(Path.join(root, 'README.md'), Path.join(root, 'dist', commitHash, 'extensions', `builtin.theme-${id}`, 'README.md'))
    await FileSystem.copyFile(
      Path.join(extensionPath, 'extension.json'),
      Path.join(root, 'dist', commitHash, 'extensions', `builtin.theme-${id}`, 'extension.json')
    )
    await FileSystem.copyFile(
      Path.join(extensionPath, 'color-theme.json'),
      Path.join(root, 'dist', commitHash, 'extensions', `builtin.theme-${id}`, 'color-theme.json')
    )
  }
  const themesJson = await JsonFile.readJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'))
  const ids = colorThemes.map(getId)
  const mergedThemes = mergeThemes(themesJson, ids)
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'themes.json'), mergedThemes)
}

const compareId = (a, b) => {
  return a.id.localeCompare(b.id)
}

const mergeLanguages = (languages, extensionLanguages) => {
  const seen = []
  const merged = []
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

const toPlaygroundFile = (file) => {
  return `/playground/${file}`
}

const addExtensionLanguages = async ({ root, extensionPath, extensionJson, commitHash, pathPrefix }) => {
  const languages = extensionJson.languages || []
  if (languages.length === 0) {
    return
  }
  const extensionId = extensionJson.id
  await FileSystem.remove(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
  await FileSystem.mkdir(Path.join(root, 'dist', commitHash, 'extensions', extensionId))
  await FileSystem.copyFile(Path.join(root, 'README.md'), Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'README.md'))
  for (const file of ['src', 'data', 'extension.json']) {
    if (await FileSystem.exists(Path.join(extensionPath, file))) {
      await FileSystem.copy(Path.join(extensionPath, file), Path.join(root, 'dist', commitHash, 'extensions', extensionId, file))
    }
  }
  const extensionLanguages = []
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
    await FileSystem.remove(Path.join(root, 'dist', commitHash, 'playground'))
    await FileSystem.copy(Path.join(extensionPath, 'test', 'cases'), Path.join(root, 'dist', commitHash, 'playground'))
    const testFiles = await FileSystem.readDir(Path.join(extensionPath, 'test', 'cases'))
    const fileMap = testFiles.map(toPlaygroundFile)
    await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'fileMap.json'), fileMap)
  }
}

const addExtensionWebExtension = async ({ root, extensionPath, commitHash, extensionJson, pathPrefix }) => {
  if (!extensionJson.browser) {
    return
  }
  const webExtensions = [
    {
      ...extensionJson,
      isWeb: true,
      path: `${pathPrefix}/${commitHash}/extensions/${extensionJson.id}`,
    },
  ]
  await JsonFile.writeJson(Path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'), webExtensions)
  for (const dirent of ['src', 'extension.json']) {
    await FileSystem.copy(Path.join(extensionPath, dirent), Path.join(root, 'dist', commitHash, 'extensions', extensionJson.id, dirent))
  }
}

const addExtension = async ({ root, extensionPath, commitHash, pathPrefix }) => {
  const extensionJson = await readExtensionManifest(Path.join(extensionPath, 'extension.json'))
  const name = extensionJson.name || extensionJson.id || ''
  const description = extensionJson.description || ''
  await addExtensionSeo({
    root,
    name,
    description,
  })
  await addExtensionThemes({
    root,
    commitHash,
    extensionJson,
    extensionPath,
  })
  await addExtensionLanguages({
    root,
    extensionPath,
    commitHash,
    extensionJson,
    pathPrefix,
  })
  await addExtensionWebExtension({
    root,
    extensionPath,
    commitHash,
    extensionJson,
    pathPrefix,
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

const getName = (name) => {
  return name.slice(0, -'.js'.length)
}
const isTestFile = (file) => {
  return file !== '_all.js'
}

const getTestFiles = (testFilesRaw) => {
  return testFilesRaw.map(getName).filter(isTestFile)
}

const addTestFiles = async ({ testPath, commitHash, root, pathPrefix }) => {
  await FileSystem.copy(`${root}/${testPath}/src`, `${root}/dist/${commitHash}/packages/extension-host-worker-tests/src`)
  const testFilesRaw = await FileSystem.readDir(`${root}/${testPath}/src`)
  const testFiles = getTestFiles(testFilesRaw)
  await FileSystem.mkdir(`${root}/dist/${commitHash}/tests`)
  await FileSystem.mkdir(`${root}/dist/tests`)
  console.log({ testFiles })
  for (const testFile of testFiles) {
    await FileSystem.copyFile(`${root}/dist/index.html`, `${root}/dist/tests/${testFile}.html`)
  }
  const testOverviewHtml = generateTestOverviewHtml(testFiles)
  await FileSystem.writeFile(`${root}/dist/tests/index.html`, testOverviewHtml)
}

/**
 *
 * @param {{root:string, pathPrefix:string , extensionPath:string, testPath:string   }} param0
 */
export const exportStatic = async ({ root, pathPrefix, extensionPath, testPath }) => {
  if (pathPrefix === 'auto') {
    const extensionJson = await readExtensionManifest(Path.join(extensionPath, 'extension.json'))
    const { id } = extensionJson
    const [author, name] = id.split('.')
    pathPrefix = `/${name}`
  }
  const dirents = await FileSystem.readDir(Path.join(root, 'node_modules', '@lvce-editor', 'server', 'static'))
  const commitHash = dirents.find(isCommitHash) || ''

  console.time('clean')
  await clean(root)
  console.timeEnd('clean')

  console.time('copyStaticFiles')
  await copyStaticFiles(root, commitHash)
  console.timeEnd('copyStaticFiles')

  console.time('applyOverrides')
  await applyOverrides({
    root,
    commitHash,
    pathPrefix,
  })
  console.timeEnd('applyOverrides')

  console.time('addExtension')
  await addExtension({
    extensionPath,
    commitHash,
    pathPrefix,
    root,
  })
  console.timeEnd('addExtension')

  if (testPath) {
    console.time('addTestFiles')
    await addTestFiles({
      testPath,
      commitHash,
      pathPrefix,
      root,
    })
    console.timeEnd('addTestFiles')
  }
}
