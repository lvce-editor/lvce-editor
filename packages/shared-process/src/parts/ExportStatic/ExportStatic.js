import fs, { cpSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import path, { join } from 'path'

// TODO
// - implement this for syntax highlighting projects
// - implement this for language features web extensions

const readExtensionManifest = (path) => {
  const content = readFileSync(path, 'utf8')
  return { ...JSON.parse(content), path }
}

/**
 *
 * @param {{root:string, pathPrefix:string  }} param0
 */
export const exportStatic = async ({ root, pathPrefix }) => {
  const dirents = readdirSync(
    join(root, 'node_modules', '@lvce-editor', 'server', 'static')
  )
  const RE_COMMIT_HASH = /^[a-z\d]+$/
  const isCommitHash = (dirent) => {
    return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
  }
  const commitHash = dirents.find(isCommitHash) || ''

  const extensionJson = readExtensionManifest(join(root, 'extension.json'))
  const name = extensionJson.id.slice('builtin.theme-'.length)
  fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

  fs.mkdirSync(path.join(root, 'dist'))

  fs.mkdirSync(
    join(root, 'dist', commitHash, 'extensions', `builtin.theme-${name}`),
    {
      recursive: true,
    }
  )
  fs.cpSync(
    join(root, 'node_modules', '@lvce-editor', 'server', 'static'),
    join(root, 'dist'),
    {
      recursive: true,
    }
  )

  const replaceSync = (path, occurrence, replacement) => {
    const oldContent = readFileSync(path, 'utf8')
    if (!oldContent.includes(occurrence)) {
      throw new Error(`failed to replace occurrence ${occurrence}: Not found`)
    }
    // @ts-ignore
    const newContent = oldContent.replaceAll(occurrence, replacement)
    writeFileSync(path, newContent)
  }

  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(
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
  replaceSync(
    join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
    `"workbench.colorTheme": "slime"`,
    `"workbench.colorTheme": "${name}"`
  )
  replaceSync(
    join(root, 'dist', commitHash, 'config', 'defaultSettings.json'),
    `"workbench.saveStateOnVisibilityChange": false`,
    `"workbench.saveStateOnVisibilityChange": true`
  )

  const extensionDirents = readdirSync(
    join(root, 'node_modules', '@lvce-editor', 'shared-process', 'extensions')
  )

  const isLanguageBasics = (dirent) => {
    return dirent.startsWith('builtin.language-basics')
  }

  const isTheme = (dirent) => {
    return dirent.startsWith('builtin.theme-')
  }

  const isIconTheme = (dirent) => {
    return dirent === 'builtin.vscode-icons'
  }

  const languageBasicsDirents = extensionDirents.filter(isLanguageBasics)
  const themeDirents = extensionDirents.filter(isTheme)
  const iconThemeDirents = extensionDirents.filter(isIconTheme)

  const writeJson = (path, json) => {
    const content = JSON.stringify(json, null, 2) + '\n'
    writeFileSync(path, content)
  }

  const getManifestPath = (dirent) => {
    return join(
      root,
      'node_modules',
      '@lvce-editor',
      'shared-process',
      'extensions',
      dirent,
      'extension.json'
    )
  }
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
  const languages = languageBasicsDirents
    .map(getManifestPath)
    .map(readExtensionManifest)
    .flatMap(getLanguages)
  writeJson(
    join(root, 'dist', commitHash, 'config', 'languages.json'),
    languages
  )

  for (const languageBasicsDirent of languageBasicsDirents) {
    cpSync(
      join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        languageBasicsDirent
      ),
      join(root, 'dist', commitHash, 'extensions', languageBasicsDirent),
      {
        recursive: true,
      }
    )
  }

  const getThemeName = (dirent) => {
    return dirent.slice('builtin.theme-'.length)
  }

  for (const themeDirent of themeDirents) {
    const themeId = getThemeName(themeDirent)
    cpSync(
      join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        themeDirent,
        'color-theme.json'
      ),
      join(root, 'dist', commitHash, 'themes', `${themeId}.json`)
    )
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

  const themeIds = mergeThemes(themeDirents.map(getThemeName), [name])
  writeJson(join(root, 'dist', commitHash, 'config', 'themes.json'), themeIds)

  for (const iconThemeDirent of iconThemeDirents) {
    const iconThemeId = iconThemeDirent.slice('builtin.'.length)
    cpSync(
      join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        iconThemeDirent,
        'icon-theme.json'
      ),
      join(root, 'dist', commitHash, 'icon-themes', `${iconThemeId}.json`)
    )
    cpSync(
      join(
        root,
        'node_modules',
        '@lvce-editor',
        'shared-process',
        'extensions',
        iconThemeDirent,
        'icons'
      ),
      join(root, 'dist', commitHash, 'file-icons'),
      {
        recursive: true,
      }
    )
  }

  cpSync(
    join(root, 'color-theme.json'),
    join(root, 'dist', commitHash, 'themes', `${name}.json`)
  )
  replaceSync(
    join(root, 'dist', 'index.html'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )
  replaceSync(
    join(root, 'dist', 'index.html'),
    `/manifest.json`,
    `${pathPrefix}/manifest.json`
  )
  replaceSync(
    join(root, 'dist', 'index.html'),
    '</title>',
    `</title>
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">`
  )
  replaceSync(
    join(root, 'dist', 'manifest.json'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )

  fs.copyFileSync(
    join(root, 'README.md'),
    join(
      root,
      'dist',
      commitHash,
      'extensions',
      `builtin.theme-${name}`,
      'README.md'
    )
  )
  fs.copyFileSync(
    join(root, 'extension.json'),
    join(
      root,
      'dist',
      commitHash,
      'extensions',
      `builtin.theme-${name}`,
      'extension.json'
    )
  )
  fs.copyFileSync(
    join(root, 'color-theme.json'),
    join(
      root,
      'dist',
      commitHash,
      'extensions',
      `builtin.theme-${name}`,
      'color-theme.json'
    )
  )

  replaceSync(
    join(root, 'dist', commitHash, 'css', 'App.css'),
    `/${commitHash}`,
    `${pathPrefix}/${commitHash}`
  )
}
