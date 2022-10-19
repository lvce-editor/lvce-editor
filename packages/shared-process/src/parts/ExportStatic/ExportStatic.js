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
    throw new Error(`failed to replace occurrence ${occurrence}: Not found`)
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
  await FileSystem.copy(
    Path.join(root, 'node_modules', '@lvce-editor', 'server', 'static'),
    Path.join(root, 'dist')
  )
}

const applyOverrides = async ({ root, commitHash, pathPrefix }) => {
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-process',
      'dist',
      'rendererProcessMain.js'
    ),
    'platform = getPlatform();',
    'platform = "web"'
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-process',
      'dist',
      'rendererProcessMain.js'
    ),
    `return "/${commitHash}";`,
    `return "${pathPrefix}/${commitHash}";`
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    'platform = getPlatform();',
    'platform = "web"'
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `platform2 = "remote";`,
    'platform2 = "web";'
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `return "/${commitHash}";`,
    `return "${pathPrefix}/${commitHash}";`
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `getColorThemeUrlWeb = (colorThemeId) => {
      return \`/extensions/builtin.theme-\${colorThemeId}/color-theme.json\`;
    };`,
    `const getColorThemeUrlWeb = (colorThemeId) => {
      const assetDir = getAssetDir()
      return \`\${assetDir}/themes/\${colorThemeId}.json\`
    }`
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `getIconThemeUrl = (iconThemeId) => {
      return \`/extensions/builtin.\${iconThemeId}/icon-theme.json\`;
    }`,
    `getIconThemeUrl = (iconThemeId) => {
      const assetDir = getAssetDir()
      return \`\${assetDir}/icon-themes/\${iconThemeId}.json\`
    }`
  )
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `return \`\${extensionPath}\${value}\``,
    `return \`${pathPrefix}/${commitHash}/file-icons/\${value.slice(7)}\``
  )

  // workaround for firefox bug
  await replace(
    Path.join(
      root,
      'dist',
      commitHash,
      'packages',
      'renderer-worker',
      'dist',
      'rendererWorkerMain.js'
    ),
    `//# sourceMappingURL`,
    `export {}
//# sourceMappingURL`
  )

  await replace(
    Path.join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
    `"workbench.saveStateOnVisibilityChange": false`,
    `"workbench.saveStateOnVisibilityChange": true`
  )

  const extensionDirents = await FileSystem.readDir(
    Path.join(
      root,
      'node_modules',
      '@lvce-editor',
      'shared-process',
      'extensions'
    )
  )

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
    return Path.join(
      root,
      'node_modules',
      '@lvce-editor',
      'shared-process',
      'extensions',
      dirent,
      'extension.json'
    )
  }

  const manifestPaths = languageBasicsDirents.map(getManifestPath)
  const manifests = await Promise.all(manifestPaths.map(readExtensionManifest))
  const languages = manifests.flatMap(getLanguages)
  await JsonFile.writeJson(
    Path.join(root, 'dist', commitHash, 'config', 'languages.json'),
    languages
  )

  for (const languageBasicsDirent of languageBasicsDirents) {
    await FileSystem.copy(
      Path.join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        languageBasicsDirent
      ),
      Path.join(root, 'dist', commitHash, 'extensions', languageBasicsDirent)
    )
  }

  for (const themeDirent of themeDirents) {
    const themeId = getThemeName(themeDirent)
    await FileSystem.copy(
      Path.join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        themeDirent,
        'color-theme.json'
      ),
      Path.join(root, 'dist', commitHash, 'themes', `${themeId}.json`)
    )
  }

  const themeIds = mergeThemes(themeDirents.map(getThemeName), [])
  await JsonFile.writeJson(
    Path.join(root, 'dist', commitHash, 'config', 'themes.json'),
    themeIds
  )

  for (const iconThemeDirent of iconThemeDirents) {
    const iconThemeId = iconThemeDirent.slice('builtin.'.length)
    await FileSystem.copy(
      Path.join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        iconThemeDirent,
        'icon-theme.json'
      ),
      Path.join(root, 'dist', commitHash, 'icon-themes', `${iconThemeId}.json`)
    )
    await FileSystem.copy(
      Path.join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        iconThemeDirent,
        'icons'
      ),
      Path.join(root, 'dist', commitHash, 'file-icons')
    )
  }
  await replace(
    Path.join(root, 'dist', 'index.html'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )
  await replace(
    Path.join(root, 'dist', 'index.html'),
    `/manifest.json`,
    `${pathPrefix}/manifest.json`
  )

  await replace(
    Path.join(root, 'dist', 'index.html'),
    '</title>',
    `</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">`
  )
  await replace(
    Path.join(root, 'dist', 'manifest.json'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )

  await replace(
    Path.join(root, 'dist', commitHash, 'css', 'App.css'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )
}

const addExtensionSeo = async ({ root, name, description }) => {
  await replace(
    Path.join(root, 'dist', 'index.html'),
    '<title>Code Editor</title>',
    `<title>${name}</title>`
  )
  await replace(
    Path.join(root, 'dist', 'manifest.json'),
    `"name": "Code Editor Web - OSS"`,
    `"name": "${name}"`
  )
  await replace(
    Path.join(root, 'dist', 'manifest.json'),
    `"short_name": "Web - OSS"`,
    `"short_name": "${name}"`
  )
  await replace(
    Path.join(root, 'dist', 'manifest.json'),
    `"description": "Web Code Editor."`,
    `"description": "${description}"`
  )
  await replace(
    Path.join(root, 'dist', 'index.html'),
    '<meta name="description" content="Online Code Editor" />',
    `<meta name="description" content="${description}" />`
  )
}

const getId = (object) => {
  return object.id
}

const addExtensionThemes = async ({ root, extensionJson, commitHash }) => {
  const colorThemes = extensionJson.colorThemes || []
  if (colorThemes.length === 0) {
    return
  }
  for (const colorTheme of colorThemes) {
    const { id, path } = colorTheme
    await FileSystem.mkdir(
      Path.join(root, 'dist', commitHash, 'extensions', `builtin.theme-${id}`)
    )
    await FileSystem.copy(
      Path.join(root, path),
      Path.join(root, 'dist', commitHash, 'themes', `${id}.json`)
    )
    await replace(
      Path.join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
      `"workbench.colorTheme": "slime"`,
      `"workbench.colorTheme": "${id}"`
    )
    await FileSystem.copyFile(
      Path.join(root, 'README.md'),
      Path.join(
        root,
        'dist',
        commitHash,
        'extensions',
        `builtin.theme-${id}`,
        'README.md'
      )
    )
    await FileSystem.copyFile(
      Path.join(root, 'extension.json'),
      Path.join(
        root,
        'dist',
        commitHash,
        'extensions',
        `builtin.theme-${id}`,
        'extension.json'
      )
    )
    await FileSystem.copyFile(
      Path.join(root, 'color-theme.json'),
      Path.join(
        root,
        'dist',
        commitHash,
        'extensions',
        `builtin.theme-${id}`,
        'color-theme.json'
      )
    )
  }
  const themesJson = await JsonFile.readJson(
    Path.join(root, 'dist', commitHash, 'config', 'themes.json')
  )
  const ids = colorThemes.map(getId)
  const mergedThemes = mergeThemes(themesJson, ids)
  await JsonFile.writeJson(
    Path.join(root, 'dist', commitHash, 'config', 'themes.json'),
    mergedThemes
  )
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

const addExtensionLanguages = async ({
  root,
  extensionJson,
  commitHash,
  pathPrefix,
}) => {
  const languages = extensionJson.languages || []
  if (languages.length === 0) {
    return
  }
  const extensionId = extensionJson.id
  await FileSystem.remove(
    Path.join(root, 'dist', commitHash, 'extensions', extensionId)
  )
  await FileSystem.mkdir(
    Path.join(root, 'dist', commitHash, 'extensions', extensionId)
  )
  await FileSystem.copyFile(
    Path.join(root, 'README.md'),
    Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'README.md')
  )
  await FileSystem.copy(
    Path.join(root, 'src'),
    Path.join(root, 'dist', commitHash, 'extensions', extensionId, 'src')
  )
  await FileSystem.copyFile(
    Path.join(root, 'extension.json'),
    Path.join(
      root,
      'dist',
      commitHash,
      'extensions',
      extensionId,
      'extension.json'
    )
  )
  const extensionLanguages = []
  for (const language of languages) {
    extensionLanguages.push({
      ...language,
      tokenize: `${pathPrefix}/${commitHash}/extensions/${extensionId}/${language.tokenize}`,
    })
  }
  const builtinLanguages = await JsonFile.readJson(
    Path.join(root, 'dist', commitHash, 'config', 'languages.json')
  )
  const mergedLanguages = mergeLanguages(builtinLanguages, extensionLanguages)
  await JsonFile.writeJson(
    Path.join(root, 'dist', commitHash, 'config', 'languages.json'),
    mergedLanguages
  )
  await FileSystem.remove(Path.join(root, 'dist', commitHash, 'playground'))
  await FileSystem.copy(
    Path.join(root, 'test', 'cases'),
    Path.join(root, 'dist', commitHash, 'playground')
  )

  const testFiles = await FileSystem.readDir(Path.join(root, 'test', 'cases'))
  const fileMap = testFiles.map(toPlaygroundFile)
  await JsonFile.writeJson(
    Path.join(root, 'dist', commitHash, 'config', 'fileMap.json'),
    fileMap
  )
}

const addExtension = async ({ root, commitHash, pathPrefix }) => {
  const extensionJson = await readExtensionManifest(
    Path.join(root, 'extension.json')
  )
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
  })
  await addExtensionLanguages({
    root,
    commitHash,
    extensionJson,
    pathPrefix,
  })
}

/**
 *
 * @param {{root:string, pathPrefix:string  }} param0
 */
export const exportStatic = async ({ root, pathPrefix }) => {
  const dirents = await FileSystem.readDir(
    Path.join(root, 'node_modules', '@lvce-editor', 'server', 'static')
  )
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
    root,
    commitHash,
    pathPrefix,
  })
  console.timeEnd('addExtension')
}
