import { readdir } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const copySharedProcessSources = async ({ to, product, commitHash, version, target = '', date }) => {
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `${to}/src`,
  })
  await Copy.copy({
    from: 'packages/shared-process/package.json',
    to: `${to}/package.json`,
  })
  await Replace.replace({
    path: `${to}/src/parts/Platform/Platform.js`,
    occurrence: `applicationName = 'lvce-oss'`,
    replacement: `applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${to}/src/parts/Platform/Platform.js`,
    occurrence: `commit = 'unknown commit'`,
    replacement: `commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: `${to}/src/parts/Platform/Platform.js`,
    occurrence: `version = '0.0.0-dev'`,
    replacement: `version = '${version}'`,
  })
  await Replace.replace({
    path: `${to}/src/parts/Platform/Platform.js`,
    occurrence: `date = ''`,
    replacement: `date = '${date}'`,
  })

  if (target === 'server') {
    await Copy.copy({
      from: 'packages/shared-process/bin',
      to: `${to}/bin`,
    })
    await Copy.copy({
      from: 'packages/shared-process/index.js',
      to: `${to}/index.js`,
    })
    await Replace.replace({
      path: 'packages/build/.tmp/server/shared-process/src/parts/Root/Root.js',
      occurrence: `export const root = resolve(__dirname, '../../../../../')`,
      replacement: `export const root = resolve(__dirname, '../../../')`,
    })
    await Replace.replace({
      path: 'packages/build/.tmp/server/shared-process/src/parts/Platform/Platform.js',
      occurrence: `Path.join(appDir, 'static', 'config', 'defaultSettings.json')`,
      replacement: `Path.join(Root.root, 'config', 'defaultSettings.json')`,
    })
    await Replace.replace({
      path: 'packages/build/.tmp/server/shared-process/src/parts/Env/Env.js',
      occurrence: `return process.env.FOLDER`,
      replacement: `return process.env.FOLDER || process.cwd()`,
    })
    await Replace.replace({
      path: 'packages/build/.tmp/server/shared-process/src/parts/Platform/Platform.js',
      occurrence: `export const getExtensionHostHelperProcessPath = async () => {
  return Path.join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
}
`,
      replacement: `export const getExtensionHostHelperProcessPath = async () => {
  const { extensionHostHelperProcessPath } = await import(
    '@lvce-editor/extension-host-helper-process'
  )
  return extensionHostHelperProcessPath
}
`,
    })
    await Replace.replace({
      path: 'packages/build/.tmp/server/shared-process/src/parts/Platform/Platform.js',
      occurrence: `export const getExtensionHostPath = async () => {
  return join(Root.root, 'packages', 'extension-host', 'src', 'extensionHostMain.js')
}
`,
      replacement: `export const getExtensionHostPath = async () => {
  const { extensionHostPath } = await import(
    '@lvce-editor/extension-host'
  )
  return extensionHostPath
}
`,
    })
    await Replace.replace({
      path: `packages/build/.tmp/server/shared-process/src/parts/PtyHostPath/PtyHostPath.js`,
      occurrence: `import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getPtyHostPath = async () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
`,
      replacement: `import * as Root from '../Root/Root.js'
import * as Path from '../Path/Path.js'

export const getPtyHostPath = async () => {
  try {
    const { ptyHostPath } = await import('@lvce-editor/pty-host')
    return ptyHostPath
  } catch {
    return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
  }
}
`,
    })
    await Copy.copyFile({
      from: 'LICENSE',
      to: `${to}/LICENSE`,
    })
    await Copy.copy({
      from: 'static/config',
      to: `${to}/config`,
    })
    // TODO where should builtinExtension be located?
    const shouldBeCopied = (extensionName) => {
      return extensionName === 'builtin.vscode-icons' || extensionName.startsWith('builtin.theme-')
    }
    const extensionNames = await readdir(Path.absolute('extensions'))
    for (const extensionName of extensionNames) {
      if (shouldBeCopied(extensionName)) {
        await Copy.copy({
          from: `extensions/${extensionName}`,
          to: `${to}/extensions/${extensionName}`,
        })
      }
    }
  }
}
