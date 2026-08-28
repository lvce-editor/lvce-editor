import * as BuildStaticServer from '../BuildStaticServer/BuildStaticServer.ts'
import * as BundleOptions from '../BundleOptions/BundleOptions.ts'
import * as BundleSharedProcessCached from '../BundleSharedProcessCached/BundleSharedProcessCached.ts'
import * as CommitHash from '../CommitHash/CommitHash.ts'
import * as Console from '../Console/Console.ts'
import * as Copy from '../Copy/Copy.ts'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Replace from '../Replace/Replace.ts'
import { getThirdPartyNoticesContent } from '../ThirdPartyNoticesContent/ThirdPartyNoticesContent.ts'
import * as Version from '../Version/Version.ts'
import * as WriteFile from '../WriteFile/WriteFile.ts'

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return [] as any[]
  }
  return [obj, ...Object.values(obj.dependencies).flatMap(getObjectDependencies)]
}

export const getServerIsStaticReplacement = (commitHash: string): string => `const hasLinkedExtensions = argvSliced.some((arg) => arg === '--link' || arg.startsWith('--link='))

const isStatic = (url) => {
  if (url === '/' || url.startsWith('/?')) {
    return !hasLinkedExtensions
  }
  if (url === '/index.html' || url.startsWith('/index.html?')) {
    return !hasLinkedExtensions
  }
  if (url.startsWith('/${commitHash}')) {
    return true
  }
  if (url.startsWith('/favicon.ico')) {
    return true
  }
  if (url === '/auth/callback' || url.startsWith('/auth/callback?')) {
    return true
  }
  if (url.startsWith('/manifest.ico')) {
    return true
  }
  return false
}`

const copyServerFiles = async ({ commitHash, product }) => {
  await Copy.copy({
    from: 'packages/server',
    to: 'packages/build/.tmp/server/server',
    ignore: ['tsconfig.json', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'packages/build/.tmp/server/server/LICENSE',
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/argvConfig.js',
    occurrence: `const applicationName = 'lvce-oss'`,
    replacement: `const applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const ROOT = resolve(__dirname, '../../../')`,
    replacement: `const ROOT = resolve(__dirname, '../')`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const sharedProcessPath = join(ROOT, 'packages', 'shared-process', 'src', 'sharedProcessMain.ts')`,
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
  if (url.startsWith('/static/icons')) {
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
  if (url === '/auth/callback' || url.startsWith('/auth/callback?')) {
    return true
  }
  if (url.startsWith('/packages') && url.endsWith('.js')) {
    return true
  }
  return false
}`,
    replacement: getServerIsStaticReplacement(commitHash),
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/server/src/server.js',
    occurrence: `const staticServerPath = join(ROOT, 'packages', 'static-server', 'src', 'static-server.ts')`,
    replacement: `const staticServerPath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server'))`,
  })

  const content = getThirdPartyNoticesContent({ commitHash })
  await WriteFile.writeFile({
    to: 'packages/build/.tmp/server/server/ThirdPartyNotices.txt',
    content,
  })
}

const sortObject = (object) => {
  return JSON.parse(JSON.stringify(object, Object.keys(object).sort()))
}

const serverPackageJsonFiles = [
  'packages/build/.tmp/server/server/package.json',
  'packages/build/.tmp/server/shared-process/package.json',
  'packages/build/.tmp/server/static-server/package.json',
]

export const setVersionsAndDependencies = async ({ version, files = serverPackageJsonFiles }) => {
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
    if (json.name === '@lvce-editor/server') {
      json.dependencies ||= {}
      json.dependencies['@lvce-editor/shared-process'] = version
      json.dependencies['@lvce-editor/static-server'] = version
    }
    if (json.name === '@lvce-editor/shared-process') {
      json.dependencies ||= {}
      const processExplorerVersion = json.optionalDependencies?.['@lvce-editor/process-explorer']
      if (processExplorerVersion) {
        json.dependencies['@lvce-editor/process-explorer'] = processExplorerVersion
        delete json.optionalDependencies['@lvce-editor/process-explorer']
      }
      const fileWatcherExplorerVersion = json.optionalDependencies?.['@lvce-editor/file-watcher-explorer']
      if (fileWatcherExplorerVersion) {
        json.dependencies['@lvce-editor/file-watcher-explorer'] = fileWatcherExplorerVersion
        delete json.optionalDependencies['@lvce-editor/file-watcher-explorer']
      }
      json.optionalDependencies ||= {}
    }
    if (json.dependencies && json.dependencies['@lvce-editor/shared-process']) {
      json.dependencies['@lvce-editor/shared-process'] = version
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
  await copyServerFiles({ commitHash, product })
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

  console.time('setVersions')
  await setVersionsAndDependencies({ version })
  console.timeEnd('setVersions')
}
