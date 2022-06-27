import { existsSync } from 'fs'
import { readdir, readFile } from 'fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleExtensionHostDependencies from '../BundleExtensionHostDependencies/BundleExtensionHostDependencies.js'
import * as BundleJs from '../BundleJs/BundleJs.js'
import * as BundleMainProcessDependencies from '../BundleMainProcessDependencies/BundleMainProcessDependencies.js'
import * as BundlePtyHostDependencies from '../BundlePtyHostDependencies/BundlePtyHostDependencies.js'
import * as BundleSharedProcessDependencies from '../BundleSharedProcessDependencies/BundleSharedProcessDependencies.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Product from '../Product/Product.js'
import * as Replace from '../Replace/Replace.js'
import * as Tag from '../Tag/Tag.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
// TODO cache -> use newest timestamp from files excluding node_modules and build/.tmp

const isLanguageBasics = (name) => {
  return name.startsWith('builtin.language-basics')
}

const readExtensionJsonFile = async (extension) => {
  const absolutePath = Path.absolute(`extensions/${extension}/extension.json`)
  const content = await readFile(absolutePath, 'utf-8')
  return content
}

const getLanguages = (content) => {
  const json = JSON.parse(content)
  const languages = json.languages || []
  return languages
}
const getLanguageBasicsNames = async () => {
  const extensionPath = Path.absolute('extensions')
  const extensions = await readdir(extensionPath)
  const languageBasics = extensions.filter(isLanguageBasics)
  return languageBasics
}

const copyLanguageBasicsExtensions = async () => {
  const languageBasics = await getLanguageBasicsNames()
  for (const languageBasic of languageBasics) {
    await Copy.copy({
      from: `extensions/${languageBasic}`,
      to: `build/.tmp/bundle/electron/extensions/${languageBasic}`,
      ignore: [
        'benchmark',
        'test',
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        '.tmp',
      ],
    })
  }
}

const isTheme = (extensionName) => {
  return extensionName.startsWith('builtin.theme')
}

const getThemeName = (extensionName) => {
  return extensionName.slice('builtin.theme-'.length)
}

const copyThemeExtensions = async () => {
  const allExtensions = await readdir(Path.absolute('extensions'))
  const themeExtensions = allExtensions.filter(isTheme)
  const themes = themeExtensions.map(getThemeName)
  for (const theme of themes) {
    await Copy.copy({
      from: `extensions/builtin.theme-${theme}`,
      to: `build/.tmp/bundle/electron/extensions/builtin.theme-${theme}`,
    })
  }
}

const copyIconThemeExtensions = async () => {
  // await Copy.copy({
  //   from: 'extensions/builtin.vscode-icons',
  //   to: 'build/.tmp/bundle/electron/extensions/builtin.vscode-icons',
  //   ignore: [
  //     'node_modules',
  //     'scripts',
  //     'package.json',
  //     'package-lock.json',
  //     'tsconfig.json',
  //     '.tmp',
  //   ],
  // })
}

const copyLanguageFeaturesExtensions = async () => {
  // for (const languageId of ['css', 'html', 'typescript']) {
  //   await Copy.copy({
  //     from: `extensions/builtin.language-features-${languageId}`,
  //     to: `build/.tmp/bundle/electron/extensions/builtin.language-features-${languageId}`,
  //   })
  // }
}

const copyOtherExtensions = async () => {
  // for (const extension of [
  //   'css-lint',
  //   'eslint',
  //   'git',
  //   'gitignore',
  //   'prettier',
  //   'self-test',
  // ]) {
  //   await Copy.copy({
  //     from: `extensions/builtin.${extension}`,
  //     to: `build/.tmp/bundle/electron/extensions/builtin.${extension}`,
  //   })
  // }
}

const copyExtensions = async () => {
  await copyLanguageBasicsExtensions()
  await copyThemeExtensions()
  await copyIconThemeExtensions()
  await copyLanguageFeaturesExtensions()
  await copyOtherExtensions()
}

const copyPtyHostFiles = async ({ arch, electronVersion, cachePath }) => {
  await BundlePtyHostDependencies.bundlePtyHostDependencies({
    electronVersion,
    arch,
    to: `${cachePath}/packages/pty-host`,
  })
}

const copyExtensionHostFiles = async ({ cachePath }) => {
  await BundleExtensionHostDependencies.bundleExtensionHostDependencies({
    to: `${cachePath}/packages/extension-host`,
  })
}

const copySharedProcessFiles = async ({ cachePath }) => {
  await BundleSharedProcessDependencies.bundleSharedProcessDependencies({
    to: `${cachePath}/packages/shared-process`,
  })
}

const copyMainProcessFiles = async ({ cachePath }) => {
  await BundleMainProcessDependencies.bundleMainProcessDependencies({
    to: `${cachePath}/packages/main-process`,
  })
}

const copyCode = async () => {
  await Copy.copyFile({
    from: 'packages/main-process/package.json',
    to: `build/.tmp/bundle/electron/packages/main-process/package.json`,
  })
  await Copy.copy({
    from: 'packages/main-process/src',
    to: `build/.tmp/bundle/electron/packages/main-process/src`,
  })
  await Copy.copy({
    from: 'packages/main-process/pages',
    to: `build/.tmp/bundle/electron/packages/main-process/pages`,
  })
  await copyExtensionHostFiles()
  await copySharedProcessFiles()
  await Copy.copyFile({
    from: 'packages/server/package.json',
    to: `build/.tmp/bundle/electron/packages/server/package.json`,
  })
  await Copy.copy({
    from: 'packages/server/src',
    to: `build/.tmp/bundle/electron/packages/server/src`,
  })
  await Copy.copy({
    from: 'packages/server/bin',
    to: `build/.tmp/bundle/electron/packages/server/bin`,
  })
  await Replace.replace({
    path: `build/.tmp/bundle/electron/packages/server/bin/server.js`,
    occurrence: '#!/usr/bin/env node',
    replacement: '',
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `build/.tmp/bundle/electron/packages/shared-process/package.json`,
  })
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `build/.tmp/bundle/electron/packages/shared-process/src`,
  })
  await Copy.copy({
    from: 'packages/shared-process/bin',
    to: `build/.tmp/bundle/electron/packages/shared-process/bin`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-process/package.json',
    to: `build/.tmp/bundle/electron/packages/renderer-process/package.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/bundle/electron/packages/renderer-process/src`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/package.json',
    to: `build/.tmp/bundle/electron/packages/renderer-worker/package.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/bundle/electron/packages/renderer-worker/src`,
  })
}

const bundleJs = async () => {
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(`build/.tmp/bundle/electron/packages/main-process`),
  //   from: `./src/mainProcessMain.js`,
  //   platform: 'node/cjs',
  //   exclude: [
  //     'electron',
  //     'fsevents',
  //     'windows-process-tree', // native module
  //   ],
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(`build/.tmp/bundle/electron/packages/shared-process`),
  //   from: `./src/sharedProcessMain.js`,
  //   platform: 'node',
  //   exclude: [
  //     'vscode-ripgrep-with-github-api-error-fix', // must include binary
  //     'fsevents', // results in error
  //     '@stroncium/procfs', // results in error
  //     'electron-clipboard-ex', // must include binary
  //   ],
  // })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/bundle/electron/packages/renderer-process`),
    from: `./src/rendererProcessMain.js`,
    platform: 'web',
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`build/.tmp/bundle/electron/packages/renderer-worker`),
    from: `./src/rendererWorkerMain.js`,
    platform: 'webworker',
  })

  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(
  //     `build/.tmp/bundle/electron/extensions/builtin.language-features-typescript`
  //   ),
  //   from: `./src/languageFeaturesTypeScriptMain.js`,
  //   platform: 'node',
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(
  //     `build/.tmp/bundle/electron/extensions/builtin.language-features-css`
  //   ),
  //   from: `./src/languageFeaturesCssMain.js`,
  //   platform: 'node',
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(
  //     `build/.tmp/bundle/electron/extensions/builtin.language-features-html`
  //   ),
  //   from: `./src/languageFeaturesHtmlMain.js`,
  //   platform: 'node',
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(
  //     `build/.tmp/bundle/electron/extensions/builtin.self-test`
  //   ),
  //   from: `./src/parts/SelfTest/SelfTest.js`,
  //   platform: 'node',
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(
  //     `build/.tmp/bundle/electron/extensions/builtin.prettier`
  //   ),
  //   from: `./src/prettierMain.js`,
  //   platform: 'node',
  // })
  // await BundleJs.bundleJs({
  //   cwd: Path.absolute(`build/.tmp/bundle/electron/extensions/builtin.eslint`),
  //   from: `./src/eslintMain.js`,
  //   platform: 'node',
  // })

  // const esBuildPath = Path.absolute('build/node_modules/esbuild/bin/esbuild')
  // console.log({ esBuildPath })
  // await Exec.exec(
  //   esBuildPath,
  //   [
  //     // 'packages/main-process/src/mainProcessMain.cjs',
  //     '--version',
  //     // '--bundle',
  //     // '--outfile=out.js',
  //   ],
  //   {
  //     cwd: `build/.tmp/bundle/electron`,
  //   }
  // )
}

const copyNodeModules = async () => {}

const getNodePtyIgnoreFiles = () => {
  const files = ['typings', 'README.md', 'scripts', 'src']
  if (!Platform.isWindows()) {
    files.push('deps')
  }
  return files
}

const getWindowsProcessTreeIgnoreFiles = () => {
  return []
}

const copyResultsPtyHost = async () => {
  const ptyHostPackageJson = await JsonFile.readJson(
    'packages/pty-host/package.json'
  )
  await JsonFile.writeJson({
    to: `build/.tmp/bundle/electron-result/resources/app/packages/pty-host/package.json`,
    value: {
      name: ptyHostPackageJson.name,
      type: ptyHostPackageJson.type,
      dependencies: ptyHostPackageJson.dependencies,
    },
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/pty-host/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/pty-host/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/pty-host/node_modules`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/pty-host/node_modules`,
    ignore: ['node-pty'],
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/pty-host/node_modules/node-pty`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/pty-host/node_modules/node-pty`,
    ignore: getNodePtyIgnoreFiles(),
  })
}

const copyResults = async () => {
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/main-process/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/main-process/src`,
  })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/packages/main-process/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/main-process/dist`,
  // })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/main-process/pages`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/main-process/pages`,
  })
  await copyResultsPtyHost()

  if (process.platform === 'win32') {
    await Copy.copy({
      from: `build/.tmp/bundle/electron/packages/main-process/node_modules/nan`,
      to: `build/.tmp/bundle/electron-result/resources/app/packages/main-process/node_modules/nan`,
      ignore: getWindowsProcessTreeIgnoreFiles(),
    })
    await Copy.copy({
      from: `build/.tmp/bundle/electron/packages/main-process/node_modules/windows-process-tree`,
      to: `build/.tmp/bundle/electron-result/resources/app/packages/main-process/node_modules/windows-process-tree`,
      ignore: getWindowsProcessTreeIgnoreFiles(),
    })
  }

  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/extension-host/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/extension-host/src`,
  })
  const sharedProcessPackageJson = await JsonFile.readJson(
    'packages/shared-process/package.json'
  )
  await JsonFile.writeJson({
    to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/package.json`,
    value: {
      name: sharedProcessPackageJson.name,
      type: sharedProcessPackageJson.type,
      dependencies: sharedProcessPackageJson.dependencies,
    },
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/shared-process/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/src`,
  })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/packages/shared-process/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/dist`,
  // })

  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/bin`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/bin`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/src`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/src`,
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/package.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/node_modules/vscode-ripgrep-with-github-api-error-fix/package.json`,
  // })

  if (
    existsSync(
      `build/.tmp/bundle/electron/packages/shared-process/node_modules/electron-clipboard-ex`
    )
  ) {
    await Copy.copy({
      from: `build/.tmp/bundle/electron/packages/shared-process/node_modules/electron-clipboard-ex`,
      to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/node_modules/electron-clipboard-ex`,
    })
  }

  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/packages/shared-process/node_modules/@stroncium/procfs`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/packages/shared-process/node_modules/@stroncium/procfs`,
  // })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-process/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-process/dist`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-process/dist`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-worker/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/renderer-worker/dist`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/renderer-worker/dist`,
  })
  const webPackageJson = await JsonFile.readJson('packages/server/package.json')
  await JsonFile.writeJson({
    to: `build/.tmp/bundle/electron-result/resources/app/packages/server/package.json`,
    value: {
      name: webPackageJson.name,
      type: webPackageJson.type,
      dependencies: webPackageJson.dependencies,
    },
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/server/src`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/server/src`,
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/packages/server/bin`,
    to: `build/.tmp/bundle/electron-result/resources/app/packages/server/bin`,
  })
  await JsonFile.writeJson({
    to: `build/.tmp/bundle/electron-result/resources/app/package.json`,
    value: {
      main: 'packages/main-process/dist/mainProcessMain.js',
      name: Product.applicationName,
      productName: Product.nameLong,
      version: Product.version,
    },
  })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/static`,
    to: `build/.tmp/bundle/electron-result/resources/app/static`,
  })
  await WriteFile.writeFile({
    to: 'build/.tmp/bundle/electron-result/resources/app/playground/index.html',
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
    to: 'build/.tmp/bundle/electron-result/resources/app/playground/index.css',
    content: `h1 { color: dodgerblue; }`,
  })
  for (const dirent of await readdir(
    Path.absolute(`build/.tmp/bundle/electron/extensions`)
  )) {
    if (isLanguageBasics(dirent)) {
      await Copy.copy({
        from: `build/.tmp/bundle/electron/extensions/${dirent}`,
        to: `build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
      })
    }
  }
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-css/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/dist`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-css/src`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/src`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-css/data`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/data`,
  // })
  // const languageFeaturesCssPackageJson = await JsonFile.readJson(
  //   'extensions/builtin.language-features-css/package.json'
  // )
  // await JsonFile.writeJson({
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/package.json`,
  //   value: {
  //     name: languageFeaturesCssPackageJson.name,
  //     type: languageFeaturesCssPackageJson.type,
  //     dependencies: languageFeaturesCssPackageJson.dependencies,
  //   },
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-css/README.md`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/README.md`,
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-css/extension.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-css/extension.json`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-html/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/dist`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-html/src`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/src`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-html/data`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/data`,
  // })
  // const languageFeaturesHtmlPackageJson = await JsonFile.readJson(
  //   'extensions/builtin.language-features-html/package.json'
  // )
  // await JsonFile.writeJson({
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/package.json`,
  //   value: {
  //     name: languageFeaturesHtmlPackageJson.name,
  //     type: languageFeaturesHtmlPackageJson.type,
  //     dependencies: languageFeaturesHtmlPackageJson.dependencies,
  //   },
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-html/README.md`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/README.md`,
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-html/extension.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-html/extension.json`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.self-test/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.self-test/dist`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.self-test/src`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.self-test/src`,
  // })
  // const selfTestPackageJson = await JsonFile.readJson(
  //   'extensions/builtin.self-test/package.json'
  // )
  // await JsonFile.writeJson({
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.self-test/package.json`,
  //   value: {
  //     name: selfTestPackageJson.name,
  //     type: selfTestPackageJson.type,
  //     dependencies: selfTestPackageJson.dependencies,
  //   },
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.self-test/README.md`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.self-test/README.md`,
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.self-test/extension.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.self-test/extension.json`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/dist`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/dist`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/src`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/src`,
  // })
  // const packageJson = await JsonFile.readJson('package.json')
  // const languageFeaturesTypeScriptPackageJson = await JsonFile.readJson(
  //   'extensions/builtin.language-features-typescript/package.json'
  // )
  // await JsonFile.writeJson({
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/package.json`,
  //   value: {
  //     name: languageFeaturesTypeScriptPackageJson.name,
  //     type: languageFeaturesTypeScriptPackageJson.type,
  //     dependencies: {
  //       ...languageFeaturesTypeScriptPackageJson.dependencies,
  //       typescript: packageJson.devDependencies.typescript,
  //     },
  //   },
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/README.md`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/README.md`,
  // })
  // await Copy.copyFile({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/extension.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/extension.json`,
  // })
  // await Copy.copyFile({
  //   from: `node_modules/typescript/package.json`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/node_modules/typescript/package.json`,
  // })
  // await Copy.copy({
  //   from: `node_modules/typescript/lib`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.language-features-typescript/node_modules/typescript/lib`,
  //   ignore: [
  //     // ignoring these files reduces size from 61.3MB to 12.1MB
  //     'tsc.js',
  //     'tsserverlibrary.js',
  //     'tsserverlibrary.d.ts',
  //     'typescript.js',
  //     'typescript.d.ts',
  //     'typescriptServices.js',
  //     'typescriptServices.d.ts',
  //     'typesMap.json',
  //     'typingsInstaller.js',
  //     'README.md',
  //     'protocol.d.ts',
  //     'cs',
  //     'de',
  //     'es',
  //     'fr',
  //     'it',
  //     'ja',
  //     'ko',
  //     'pl',
  //     'pt-br',
  //     'ru',
  //     'tr',
  //     'zh-cn',
  //     'zh-tw',
  //   ],
  // })
  await Copy.copy({
    from: `build/.tmp/bundle/electron/extensions/builtin.theme-slime`,
    to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.theme-slime`,
  })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.vscode-icons`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.vscode-icons`,
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.prettier`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.prettier`,
  //   ignore: [
  //     'node_modules',
  //     'playground',
  //     'test',
  //     'package-lock.json',
  //     'tsconfig.json',
  //   ],
  // })
  // await Copy.copy({
  //   from: `build/.tmp/bundle/electron/extensions/builtin.eslint`,
  //   to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.eslint`,
  //   ignore: [
  //     'node_modules',
  //     'playground',
  //     'test',
  //     'package-lock.json',
  //     'tsconfig.json',
  //   ],
  // })

  for (const dirent of await readdir(
    Path.absolute(`build/.tmp/bundle/electron/extensions`)
  )) {
    if (!dirent.startsWith('builtin.theme-')) {
      continue
    }
    await Copy.copy({
      from: `build/.tmp/bundle/electron/extensions/${dirent}`,
      to: `build/.tmp/bundle/electron-result/resources/app/extensions/${dirent}`,
      ignore: ['node_modules', 'test', 'package-lock.json'],
    })
  }
}

const getElectronVersion = async () => {
  const packageJson = await JsonFile.readJson(
    'packages/main-process/node_modules/electron/package.json'
  )
  return packageJson.version
}

const applyOverridesPre = async () => {
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Root/Root.js',
    occurrence: `root = join(__dirname, '../../../../..')`,
    replacement: `root = join(__dirname, '../../..')`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.isProduction = () => {
  return false
}`,
    replacement: `exports.isProduction = () => {
  return true
}`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.getApplicationName = () => {
  return 'lvce-oss'
}`,
    replacement: `exports.getApplicationName = () => {
  return '${Product.nameLong}'
}`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.isLinux = () => {
  return process.platform === 'linux'
}`,
    replacement: `exports.isLinux = () => {
  return ${Platform.isLinux()}
}`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.isMacOs = () => {
  return process.platform === 'darwin'
}`,
    replacement: `exports.isMacOs = () => {
  return ${Platform.isMacos()}
}`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `process.env.BUILTIN_SELF_TEST_PATH`,
    replacement: `join(Root.root, 'extensions', 'builtin.self-test', 'dist', 'SelfTest.js')`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.getScheme = () => {
  return 'lvce-oss'
}`,
    replacement: `exports.getScheme = () => {
  return '${Product.applicationName}'
}`,
  })
  const commitHash = await CommitHash.getCommitHash()
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.getCommit = () => {
  return 'unknown commit'
}`,
    replacement: `exports.getCommit = () => {
  return '${commitHash}'
}`,
  })
  const version = await Tag.getGitTag()
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/Platform/Platform.js',
    occurrence: `exports.getVersion = () => {
  return '0.0.0-dev'
}`,
    replacement: `exports.getVersion = () => {
  return '${version}'
}`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/SharedProcess/SharedProcess.js',
    occurrence: `packages/shared-process/src/sharedProcessMain.js`,
    replacement: `packages/shared-process/dist/sharedProcessMain.js`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/main-process/src/parts/ChildProcess/ChildProcess.js',
    occurrence: 'const METHOD_PREFERRED = METHOD_SPAWN',
    replacement: 'const METHOD_PREFERRED = METHOD_FORK',
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/server/src/server.js',
    occurrence: 'shared-process/src/sharedProcessMain.js',
    replacement: 'shared-process/dist/sharedProcessMain.js',
  })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/shared-process/src/parts/Platform/Platform.js',
  //   occurrence: 'state.getExtensionHostPath()',
  //   replacement: `Path.join(Root.root, 'packages', 'extension-host', 'dist', 'extensionHostMain.js')`,
  // })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/shared-process/src/parts/Platform/Platform.js',
    occurrence: `getApplicationName() {
    return 'lvce-oss'
  }`,
    replacement: `getApplicationName() {
    return '${Product.applicationName}'
  }`,
  })
  // path of is different in build folder
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/shared-process/src/parts/Root/Root.js',
    occurrence: `export const root = resolve(__dirname, '../../../../../')`,
    replacement: `export const root = resolve(__dirname, '../../../')`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/static/index-electron.html',
    occurrence: `src="packages/renderer-process/src/rendererProcessMain.js"`,
    replacement: `src="packages/renderer-process/dist/rendererProcessMain.js"`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/static/index-electron.html',
    occurrence: `packages/renderer-worker/src/rendererWorkerMain.js`,
    replacement: `packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js',
    occurrence: `packages/renderer-worker/src/rendererWorkerMain.js`,
    replacement: `packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/shared-process/src/parts/Terminal/Terminal.js',
    occurrence: `packages/pty-host/bin/ptyHost.js`,
    replacement: `packages/pty-host/dist/ptyHostMain.js`,
  })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-css/src/parts/Root/Root.js',
  //   occurrence: `root = join(__dirname, '..', '..', '..')`,
  //   replacement: `root = join(__dirname, '..')`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-html/src/parts/Root/Root.js',
  //   occurrence: `root = join(__dirname, '..', '..', '..')`,
  //   replacement: `root = join(__dirname, '..')`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/src/parts/Root/Root.js',
  //   occurrence: `root = join(__dirname, '..', '..', '..')`,
  //   replacement: `root = join(__dirname, '..')`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/src/parts/Platform/Platform.js',
  //   occurrence: `process.env.TS_SERVER_PATH`,
  //   replacement: `join(Root.root, 'node_modules', 'typescript', 'lib','tsserver.js')`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.self-test/src/parts/Root/Root.js',
  //   occurrence: `root = join(__dirname, '..', '..', '..', '..', '..')`,
  //   replacement: `root = join(__dirname, '..', '..')`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.self-test/src/parts/Platform/Platform.js',
  //   occurrence: `process.env.ELECTRON_BINARY_PATH`,
  //   replacement: `join(Root.root, '..', '..', '..', '${Product.applicationName}')`, // TODO support windows and macos
  // })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/renderer-process/src/parts/Platform/Platform.js',
    occurrence: 'ASSET_DIR',
    replacement: `'../../../../..'`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/renderer-worker/src/parts/Platform/Platform.js',
    occurrence: 'PLATFORM',
    replacement: `'electron'`,
  })

  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/renderer-worker/src/parts/Platform/Platform.js',
    occurrence: 'IS_MOBILE_OR_TABLET',
    replacement: `false`,
  })
  await Replace.replace({
    path: 'build/.tmp/bundle/electron/packages/renderer-worker/src/parts/Platform/Platform.js',
    occurrence: 'ASSET_DIR',
    replacement: `'../../../../..'`,
  })
}

const applyOverridesPost = async () => {
  // workaround for esbuild bug https://github.com/evanw/esbuild/issues/700
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/shared-process/dist/sharedProcessMain.js',
  //   occurrence: `var __create = Object.create;`,
  //   replacement: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); var __create = Object.create;`,
  // })
  // workaround for esbuild bug https://github.com/evanw/esbuild/issues/1874
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/shared-process/dist/sharedProcessMain.js',
  //   occurrence: `.join(__dirname, "xdg-open")`,
  //   replacement: `.join("/non-existent", "xdg-open")`,
  // })
  // workaround for esbuild bug https://github.com/evanw/esbuild/issues/700
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.self-test/dist/SelfTest.js',
  //   occurrence: `var __create = Object.create;`,
  //   replacement: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); var __create = Object.create;`,
  // })
  // workaround for esbuild issue with electron-clipboard-ex
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/shared-process/dist/sharedProcessMain.js',
  //   occurrence: `import clipboardEx from "electron-clipboard-ex";`,
  //   replacement: `let clipboardEx; try { clipboardEx = require("electron-clipboard-ex"); } catch { /* ignore */ };`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/shared-process/dist/sharedProcessMain.js',
  //   occurrence: `const isBundled = !__dirname || __dirname === "/"`,
  //   replacement: `const isBundled = true`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/packages/extension-host/dist/extensionHostMain.js',
  //   occurrence: `var __create = Object.create;`,
  //   replacement: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); var __create = Object.create;`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-css/extension.json',
  //   occurrence: `src/`,
  //   replacement: `dist/`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-html/extension.json',
  //   occurrence: `src/`,
  //   replacement: `dist/`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/extension.json',
  //   occurrence: `src/`,
  //   replacement: `dist/`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.language-features-typescript/dist/languageFeaturesTypeScriptMain.js',
  //   occurrence: `var __create = Object.create;`,
  //   replacement: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); var __create = Object.create;`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.prettier/extension.json',
  //   occurrence: `src/`,
  //   replacement: `dist/`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.prettier/dist/prettierMain.js',
  //   occurrence: `var __create = Object.create;`,
  //   replacement: `import { createRequire } from 'module'; const require = createRequire(import.meta.url); var __create = Object.create;`,
  // })
  // await Replace.replace({
  //   path: 'build/.tmp/bundle/electron/extensions/builtin.eslint/extension.json',
  //   occurrence: `src/`,
  //   replacement: `dist/`,
  // })
}

const bundleCss = async () => {
  await BundleCss.bundleCss({
    to: 'build/.tmp/bundle/electron/static/css/App.css',
  })
}

export const bundleElectronAppDependencies = async ({ cachePath, arch }) => {
  const electronVersion = await getElectronVersion()
  console.time('copyPtyHostFiles')
  await copyPtyHostFiles({
    arch,
    electronVersion,
    cachePath,
  })
  console.timeEnd('copyPtyHostFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles({
    cachePath,
  })
  console.timeEnd('copyExtensionHostFiles')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles({
    cachePath,
  })
  console.timeEnd('copySharedProcessFiles')

  console.time('copyMainProcessFiles')
  await copyMainProcessFiles({
    cachePath,
  })
  console.timeEnd('copyMainProcessFiles')

  // console.time('copyCode')
  // await copyCode()
  // console.timeEnd('copyCode')
  // console.time('copyCode')
  // await copyCode()
  // console.timeEnd('copyCode')
  // console.time('copyExtensions')
  // await copyExtensions()
  // console.timeEnd('copyExtensions')
  // console.time('copyStaticFiles')
  // await copyStaticFiles()
  // console.timeEnd('copyStaticFiles')
  // console.time('applyOverridesPre')
  // await applyOverridesPre()
  // console.timeEnd('applyOverridesPre')
  // console.time('copyNodeModules')
  // await copyNodeModules()
  // console.timeEnd('copyNodeModules')
  // console.time('bundleJs')
  // await bundleJs()
  // console.timeEnd('bundleJs')
  // console.time('bundleCss')
  // await bundleCss()
  // console.timeEnd('bundleCss')
  // console.time('applyOverridesPost')
  // await applyOverridesPost()
  // console.timeEnd('applyOverridesPost')
  // console.time('rebuildNativeDependencies')
  // await rebuildNativeDependencies(arch)
  // console.timeEnd('rebuildNativeDependencies')

  // console.time('copyResults')
  // await copyResults()
  // console.timeEnd('copyResults')
}
