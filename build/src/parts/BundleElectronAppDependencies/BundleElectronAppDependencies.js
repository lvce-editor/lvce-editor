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

const bundleJs = async () => {
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
}

const copyResults = async () => {
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
  await Copy.copy({
    from: `build/.tmp/bundle/electron/extensions/builtin.theme-slime`,
    to: `build/.tmp/bundle/electron-result/resources/app/extensions/builtin.theme-slime`,
  })

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

const addRootPackageJson = async ({ cachePath }) => {
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      main: 'packages/main-process/src/mainProcessMain.js',
      name: Product.applicationName,
      productName: Product.nameLong,
      version: Product.version,
    },
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

  console.time('addRootPackageJson')
  await addRootPackageJson({ cachePath })
  console.timeEnd('addRootPackageJson')

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
}
