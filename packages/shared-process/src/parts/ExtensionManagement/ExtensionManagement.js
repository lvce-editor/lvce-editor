import { mkdir, readdir, rename, rm } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import VError from 'verror'
import * as Debug from '../Debug/Debug.js'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Queue from '../Queue/Queue.js'

const isLanguageBasics = (extension) => {
  if (extension && extension.id) {
    return extension.id.includes('language-basics')
  }
  return false
}

const getEnabledExtensionWithOnlyExtension = (
  builtinExtensions,
  onlyExtension
) => {
  const extensions = []
  for (const builtinExtension of builtinExtensions) {
    if (builtinExtension.id === onlyExtension.id) {
      continue
    }
    extensions.push(builtinExtension)
  }
  extensions.push(onlyExtension)
  return extensions
}

export const install = async (id) => {
  // TODO this should be a stateless function, renderer-worker should have info on marketplace url
  // TODO use command.execute
  try {
    const { download } = await import('../Download/Download.js')
    const { extractTarBr } = await import('../Extract/Extract.js')
    const marketplaceUrl = Platform.getMarketplaceUrl()
    Debug.debug(`ExtensionManagement#install ${id}`)
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const extensionsPath = Platform.getExtensionsPath()
    // TODO maybe a queue is over engineering here
    await Queue.add('download', async () => {
      Debug.debug(`ExtensionManagement#download ${id}`)
      // TODO use command.execute
      await download(
        `${marketplaceUrl}/download/${id}`,
        Path.join(cachedExtensionsPath, `${id}.tar.br`)
      )
      Debug.debug(`ExtensionManagement#extract ${id}`)
      await extractTarBr(
        Path.join(cachedExtensionsPath, `${id}.tar.br`),
        Path.join(extensionsPath, id)
      )
    })
    // TODO should this be here? (probably not)
    // await ExtensionHost.enableExtension({
    //   id,
    //   type: 'marketplace',
    // })
  } catch (error) {
    throw new VError(error, `Failed to install extension "${id}"`)
  }
}

export const uninstall = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#uninstall ${id}`)
    const extensionsPath = Platform.getExtensionsPath()
    await rm(Path.join(extensionsPath, id), { recursive: true })
  } catch (error) {
    // if (error.code === 'ENOENT') {
    //   return
    // }
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
}

export const enable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#enable ${id}`)
    const extensionsPath = Platform.getExtensionsPath()
    const disabledExtensionsPath = Platform.getDisabledExtensionsPath()
    await mkdir(extensionsPath, { recursive: true })
    await rename(
      Path.join(disabledExtensionsPath, id),
      Path.join(extensionsPath, id)
    )
  } catch (error) {
    throw new VError(error, `Failed to enable extension "${id}"`)
  }
}

export const disable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#disable ${id}`)
    const disabledExtensionsPath = Platform.getDisabledExtensionsPath()
    const extensionsPath = Platform.getExtensionsPath()
    await mkdir(disabledExtensionsPath, { recursive: true })
    await rename(
      Path.join(extensionsPath, id),
      Path.join(disabledExtensionsPath, id)
    )
  } catch (error) {
    throw new VError(error, `Failed to disable extension ${id}`)
  }
}

const getAbsoluteDisabledPath = (dirent) => {
  const disabledExtensionsPath = Platform.getDisabledExtensionsPath()
  return Path.join(disabledExtensionsPath, dirent)
}

const getDisabledExtensionPaths = async () => {
  try {
    const disabledExtensionsPaths = Platform.getDisabledExtensionsPath()
    const dirents = await readdir(disabledExtensionsPaths)
    const paths = dirents.map(getAbsoluteDisabledPath)
    return paths
  } catch {
    // TODO handle error
    return []
  }
}

const getAbsoluteBuiltinExtensionPath = (dirent) => {
  const builtinExtensionsPath = Platform.getBuiltinExtensionsPath()
  return Path.join(builtinExtensionsPath, dirent)
}

const isIncludedBuiltinExtension = (dirent) => {
  const SKIPPED = [
    'hello-world',
    'vite',
    'soundcloud',
    'npm',
    // 'builtin.git', ~40MB memory usage (too many file watchers)
    // 'builtin.prettier',  ~20MB memory usage (maybe lazyload prettier)
    // 'language-features-typescript',
    // 'builtin.vscode-icons',
  ]
  return !SKIPPED.includes(dirent)
}

// TODO pass builtin extensions path from renderer-worker
// only negative: more messages sent between renderer-worker and shared process on startup
const getBuiltinExtensionPaths = async () => {
  try {
    const builtinExtensionsPath = Platform.getBuiltinExtensionsPath()
    const dirents = await readdir(builtinExtensionsPath)
    const filteredDirents = dirents.filter(isIncludedBuiltinExtension)
    const paths = filteredDirents.map(getAbsoluteBuiltinExtensionPath)
    return paths
  } catch {
    console.info('no builtin extension paths found')
    return []
  }
}

const getAbsoluteInstalledExtensionPath = (dirent) => {
  const extensionsPath = Platform.getExtensionsPath()
  return Path.join(extensionsPath, dirent)
}

const getInstalledExtensionPaths = async () => {
  try {
    const extensionsPath = Platform.getExtensionsPath()
    const dirents = await readdir(extensionsPath)
    const paths = dirents.map(getAbsoluteInstalledExtensionPath)
    return paths
  } catch (error) {
    // TODO how to make typescript happy?
    // @ts-ignore
    if (error.code === 'ENOENT') {
      // TODO what if mkdir fails?
      await mkdir(Platform.getExtensionsPath(), { recursive: true })
      return []
    }
    throw new VError(error, 'Failed to get installed extensions')
  }
}

export const getBuiltinExtensions = async () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getBuiltinExtensionsPath(),
    },
  ])
}

export const getInstalledExtensions = () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getExtensionsPath(),
    },
  ])
}

export const getExtensions = async () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.OnlyExtension,
      path: Platform.getOnlyExtensionPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getLinkedExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getBuiltinExtensionsPath(),
    },
  ])
}

export const getDisabledExtensions = async () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getDisabledExtensionsPath(),
    },
  ])
}

export const getAllExtensions = async () => {
  const onlyExtensionPath = Platform.getOnlyExtensionPath()
  if (onlyExtensionPath) {
    return ExtensionManifests.getAll([
      {
        type: ExtensionManifestInputType.OnlyExtension,
        path: onlyExtensionPath,
      },
    ])
  }
  const t1 = performance.now()
  const [builtinExtensions, installedExtensions, disabledExtensions] =
    // TODO handle error when one of them fails
    await Promise.all([
      getBuiltinExtensions(),
      getInstalledExtensions(),
      getDisabledExtensions(),
    ])
  const t4 = performance.now()
  // TODO can optimize this by loading extension manifest while loading paths (though 2ms isn't a bottleneck right now)
  // e.g.
  // await Promise.all([getBuiltinExtensionPaths.then(getExtensionManifests), getInstalledExtensionPaths.then(getExtensionManifests)])
  const timings = {
    total: t4 - t1,
  }
  // console.log(timings)
  return [...builtinExtensions, ...installedExtensions, ...disabledExtensions]
}
