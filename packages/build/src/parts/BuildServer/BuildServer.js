import * as BuildStaticServer from '../BuildStaticServer/BuildStaticServer.js'
import * as BundleOptions from '../BundleOptions/BundleOptions.js'
import * as BundleSharedProcessCached from '../BundleSharedProcessCached/BundleSharedProcessCached.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import { getThirdPartyNoticesContent } from '../ThirdPartyNoticesContent/ThirdPartyNoticesContent.js'
import * as Version from '../Version/Version.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [obj, ...Object.values(obj.dependencies).flatMap(getObjectDependencies)]
}

const copyServerFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'packages/server',
    to: 'packages/build/.tmp/server/server',
    ignore: ['tsconfig.json', 'node_modules', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'packages/build/.tmp/server/server/LICENSE',
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const ROOT = resolve(__dirname, '../../../')`,
    replacement: `const ROOT = resolve(__dirname, '../')`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const sharedProcessPath = join(ROOT, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')`,
    replacement: `const sharedProcessUrl = new URL('src/sharedProcessMain.js', import.meta.resolve('@lvce-editor/shared-process')).toString()
  const sharedProcessPath = fileURLToPath(sharedProcessUrl)`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const isStatic = (url) => {
  if (url.startsWith('/config')) {
    return true
  }
  if (url.startsWith('/css')) {
    return true
  }
  if (url.startsWith('/fonts')) {
    return true
  }
  if (url.startsWith('/icons')) {
    return true
  }
  if (url.startsWith('/images')) {
    return true
  }
  if (url.startsWith('/js')) {
    return true
  }
  if (url.startsWith('/lib-css')) {
    return true
  }
  if (url.startsWith('/sounds')) {
    return true
  }
  if (url.startsWith('/themes')) {
    return true
  }
  if (url.startsWith('/favicon.ico')) {
    return true
  }
  if (url.startsWith('/manifest.json')) {
    return true
  }
  if (url.startsWith('/packages') && url.endsWith('.js')) {
    return true
  }
  return false
}`,
    replacement: `const isStatic = (url) => {
  if(url === '/'){
    return true
  }
  if (url.startsWith('/${commitHash}')) {
    return true
  }
  if (url.startsWith('/favicon.ico')) {
    return true
  }
  if (url.startsWith('/manifest.ico')) {
    return true
  }
  return false
}`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const staticServerPath = join(ROOT, 'packages', 'static-server', 'src', 'static-server.js')`,
    replacement: `const staticServerPath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server'))`,
  })

  const content = getThirdPartyNoticesContent({ commitHash })
  await WriteFile.writeFile({
    to: 'packages/build/.tmp/server/server/ThirdPartyNotices.txt',
    content,
  })
}

const copyExtensionHostFiles = async () => {
  await Copy.copy({
    from: 'packages/extension-host',
    to: 'packages/build/.tmp/server/extension-host',
    ignore: ['tsconfig.json', 'node_modules', 'distmin', 'example', 'test', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'packages/build/.tmp/server/extension-host/LICENSE',
  })
}

const copyExtensionHostHelperProcessFiles = async () => {
  await Copy.copy({
    from: 'packages/extension-host-helper-process',
    to: 'packages/build/.tmp/server/extension-host-helper-process',
    ignore: ['tsconfig.json', 'node_modules', 'distmin', 'example', 'test', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'packages/build/.tmp/server/extension-host-helper-process/LICENSE',
  })
}

const sortObject = (object) => {
  return JSON.parse(JSON.stringify(object, Object.keys(object).sort()))
}

const setVersionsAndDependencies = async ({ version }) => {
  const files = [
    'packages/build/.tmp/server/extension-host-helper-process/package.json',
    'packages/build/.tmp/server/extension-host/package.json',
    'packages/build/.tmp/server/server/package.json',
    'packages/build/.tmp/server/shared-process/package.json',
    'packages/build/.tmp/server/static-server/package.json',
  ]
  for (const file of files) {
    const json = await JsonFile.readJson(file)
    delete json['xo']
    delete json['scripts']
    delete json['devDependencies']
    delete json['jest']
    if (json['optionalDependencies']) {
      delete json['optionalDependencies']['@vscode/windows-process-tree']
      delete json['optionalDependencies']['symlink-dir']
    }
    if (file === 'packages/build/.tmp/server/server/package.json') {
      json.dependencies['@lvce-editor/shared-process'] = version
      json.dependencies['@lvce-editor/static-server'] = version
    }
    if (file === 'packages/build/.tmp/server/shared-process/package.json') {
      json.dependencies['@lvce-editor/extension-host-helper-process'] = version
      json.optionalDependencies ||= {}
      delete json.optionalDependencies['@lvce-editor/process-explorer']
    }
    if (json.dependencies && json.dependencies['@lvce-editor/shared-process']) {
      json.dependencies['@lvce-editor/shared-process'] = version
    }
    if (json.dependencies && json.dependencies['@lvce-editor/extension-host']) {
      json.dependencies['@lvce-editor/extension-host'] = version
    }
    if (json.dependencies && json.dependencies['@lvce-editor/extension-host-helper-process']) {
      json.dependencies['@lvce-editor/extension-host-helper-process'] = version
    }
    if (json.dependencies) {
      json.dependencies = sortObject(json.dependencies)
    }
    if (json.version) {
      json.version = version
    }

    await JsonFile.writeJson({
      to: file,
      value: json,
    })
  }
}

export const build = async ({ product }) => {
  const commitHash = await CommitHash.getCommitHash()
  const version = await Version.getVersion()
  const date = await GetCommitDate.getCommitDate(commitHash)
  const bundleSharedProcess = BundleOptions.bundleSharedProcess

  Console.time('clean')
  await Remove.remove('packages/build/.tmp/server')
  await Remove.remove('packages/build/.tmp/static-server')
  Console.timeEnd('clean')

  await BuildStaticServer.buildStaticServer({
    commitHash,
    date,
    version,
    product,
  })
  console.time('copyServerFiles')
  await copyServerFiles({ commitHash })
  console.timeEnd('copyServerFiles')

  const sharedProcessCachePath = await BundleSharedProcessCached.bundleSharedProcessCached({
    commitHash,
    product,
    version,
    bundleSharedProcess,
    date,
    target: 'server',
    isArchLinux: false,
    isAppImage: false,
  })

  console.time('copySharedProcessFiles')
  await Copy.copy({
    from: sharedProcessCachePath,
    to: 'packages/build/.tmp/server/shared-process',
  })
  console.timeEnd('copySharedProcessFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles()
  console.timeEnd('copyExtensionHostFiles')

  console.time('copyExtensionHostHelperProcessFiles')
  await copyExtensionHostHelperProcessFiles()
  console.timeEnd('copyExtensionHostHelperProcessFiles')

  console.time('setVersions')
  await setVersionsAndDependencies({ version })
  console.timeEnd('setVersions')
}
