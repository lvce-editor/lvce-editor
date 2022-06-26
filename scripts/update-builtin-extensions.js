import { writeFile } from 'fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'url'
import builtinExtensions from '../build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json' assert { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..')

const getRepository = (name) => {
  if (name.startsWith('builtin.')) {
    return 'lvce-editor/' + name.slice('builtin.'.length)
  }
  throw new Error(`expected extension name to start with builtin.`)
}

const getName = (extension) => {
  return extension.name
}
const getReleases = async (repository) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/releases`
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const json = await response.json()
    return json
  } catch (error) {
    // @ts-ignore
    throw new Error(`Failed to get releases for ${repository}`, {
      cause: error,
    })
  }
}

const getLatestRelease = (json) => {
  if (json.length === 0) {
    throw new Error('expected releases to have length of at least one')
  }
  const release = json[0]
  const assets = release.assets
  if (assets.length === 0) {
    throw new Error('expected release assets to have length of at least one')
  }
  const asset = assets[0]
  const browserDownloadUrl = asset['browser_download_url']
  if (!browserDownloadUrl) {
    throw new Error('expected browser download url to be defined')
  }
  return browserDownloadUrl
}

const equals = (arrayA, arrayB) => {
  if (arrayA.length !== arrayB.length) {
    return false
  }
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false
    }
  }
  return true
}

const getNewBuiltinExtensions = (builtinExtensions, releases) => {
  const newBuiltinExtensions = []
  for (let i = 0; i < builtinExtensions.length; i++) {
    const extension = builtinExtensions[i]
    newBuiltinExtensions.push({
      ...extension,
      path: releases[i],
    })
  }
  return newBuiltinExtensions
}

const main = async () => {
  const start = performance.now()
  const repositories = builtinExtensions.map(getName).map(getRepository)
  const releases = await Promise.all(repositories.map(getReleases))
  const latestReleases = releases.map(getLatestRelease)
  const newBuiltinExtensions = getNewBuiltinExtensions(
    builtinExtensions,
    latestReleases
  )
  const end = performance.now()
  const duration = end - start
  if (equals(builtinExtensions, newBuiltinExtensions)) {
    console.info(`all releases are up to date in ${duration}ms`)
  } else {
    const builtinExtensionsPath = join(
      root,
      'build',
      'src',
      'parts',
      'DownloadBuiltinExtensions',
      'builtinExtensions.json'
    )
    await writeFile(
      builtinExtensionsPath,
      JSON.stringify(newBuiltinExtensions, null, 2)
    )
    // TODO print which releases were updated
    console.info(`updated releases in ${duration}ms`)
  }
}

main()
