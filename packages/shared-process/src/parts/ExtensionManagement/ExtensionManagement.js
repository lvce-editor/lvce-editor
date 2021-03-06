import { mkdir, readdir, rename, rm } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import path from 'node:path'
import isObject from 'is-object'
import VError from 'verror'
import * as Debug from '../Debug/Debug.js'
import * as Error from '../Error/Error.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Queue from '../Queue/Queue.js'

const isLanguageBasics = (extension) => {
  return extension.id.includes('language-basics')
}

export const state = {
  async getExtensions() {
    // TODO only read from env once
    const builtinExtensions = await getBuiltinExtensions()
    if (process.env.ONLY_EXTENSION) {
      const absolutePath = path.resolve(process.env.ONLY_EXTENSION)
      const onlyExtension = await getExtensionManifests([absolutePath])
      return [...builtinExtensions.filter(isLanguageBasics), ...onlyExtension]
    }
    const installedExtensions = await getInstalledExtensions()
    return [...builtinExtensions, ...installedExtensions]
  },
  async getThemeExtensions() {
    const builtinExtensionsPath = Platform.getBuiltinExtensionsPath()
    const dirents = await readdir(builtinExtensionsPath)
    const paths = []
    for (const dirent of dirents) {
      if (isTheme(dirent)) {
        paths.push(getAbsoluteBuiltinExtensionPath(dirent))
      }
    }
    if (process.env.ONLY_EXTENSION && isTheme(process.env.ONLY_EXTENSION)) {
      paths.push(process.env.ONLY_EXTENSION)
    }
    const builtinExtensions = await getExtensionManifests(paths)
    return builtinExtensions
  },
}

export const install = async (id) => {
  // TODO this should be a stateless function, renderer-worker should have info on marketplace url
  // TODO use command.execute
  try {
    const { download, extract } = await import('../Download/Download.js')
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
      await extract(
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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_EXT_INSTALL_FAILED',
      message: `Failed to install extension "${id}"`,
    })
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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_EXT_UNINSTALL_FAILED',
      message: `Failed to uninstall extension "${id}"`,
    })
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
    throw new Error.OperationalError({
      cause: error,
      message: `Failed to enable extension "${id}"`,
      code: 'E_EXTENSION_ENABLING_FAILED',
    })
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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_EXTENSION_DISABLING_FAILED',
      message: `Failed to disable extension ${id}`,
    })
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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FAILED_TO_LOAD_INSTALLED_EXTENSIONS',
      message: 'Failed to get installed extensions',
    })
  }
}

const RE_EXTENSION_FRAGMENT = /.+(\/|\\)(.+)$/

const inferExtensionId = (absolutePath) => {
  const match = absolutePath.match(RE_EXTENSION_FRAGMENT)
  if (match) {
    return match[2]
  }
  return ''
}

// TODO json parsing and error handling should happen in renderer process
const getExtensionManifest = async (path) => {
  try {
    const absolutePath = Path.join(path, 'extension.json')
    const json = await ReadJson.readJson(absolutePath)
    if (!isObject(json)) {
      // TODO should include stack of extension json file here
      throw new VError('Invalid manifest file: Not an JSON object.')
    }
    return {
      ...json,
      path,
      status: 'fulfilled',
    }
  } catch (error) {
    const id = inferExtensionId(path)
    return {
      path,
      status: 'rejected',
      reason: new Error.OperationalError({
        cause: error,
        code: 'E_LOADING_EXTENSION_MANIFEST_FAilED',
        message: `Failed to load extension "${id}": Failed to load extension manifest`,
        // @ts-ignore
        stack: error.stack,
      }),
    }
  }
}

const isRejected = (promise) => {
  return promise.status === 'rejected'
}

/**
 * @param {string[]} paths
 */
const getExtensionManifests = async (paths) => {
  const allResults = await Promise.all(paths.map(getExtensionManifest))
  return allResults
}

export const getBuiltinExtensions = async () => {
  const builtinExtensionPaths = await getBuiltinExtensionPaths()
  const builtinExtensions = await getExtensionManifests(builtinExtensionPaths)
  return builtinExtensions
}

export const getInstalledExtensions = async () => {
  const installedExtensionPaths = await getInstalledExtensionPaths()
  const installedExtensions = await getExtensionManifests(
    installedExtensionPaths
  )
  return installedExtensions
}

export const getExtensions = async () => {
  return state.getExtensions()
}

const RE_THEME = /[a-z]+\.[a-z\-]*theme-[a-z\d\-]+$/
const isTheme = (extensionId) => {
  return RE_THEME.test(extensionId)
}

const getThemeExtensionsBuiltin = async () => {
  const builtinExtensionsPath = Platform.getBuiltinExtensionsPath()
  const dirents = await readdir(builtinExtensionsPath)
  const filteredDirents = dirents.filter(isTheme)
  const paths = filteredDirents.map(getAbsoluteBuiltinExtensionPath)
}

export const getThemeExtensions = async () => {
  return state.getThemeExtensions()
}

export const getDisabledExtensions = async () => {
  const disabledExtensionPaths = await getDisabledExtensionPaths()
  const disabledExtensions = await getExtensionManifests(disabledExtensionPaths)
  return disabledExtensions
}

export const getAllExtensions = async () => {
  if (process.env.ONLY_EXTENSION) {
    return getExtensionManifests([process.env.ONLY_EXTENSION])
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
