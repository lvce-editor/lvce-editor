import { writeFile } from 'fs/promises'
import got, { HTTPError } from 'got'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import VError from 'verror'
import builtinExtensions from '../DownloadBuiltinExtensions/builtinExtensions.json' assert { type: 'json' }
import * as Root from '../Root/Root.js'

const getRepository = (name) => {
  if (name.startsWith('builtin.')) {
    return 'lvce-editor/' + name.slice('builtin.'.length)
  }
  throw new Error(`expected extension name to start with builtin.`)
}

const getName = (extension) => {
  return extension.name
}

/**
 *
 * @param {HTTPError} error
 */
const getHttpErrorMessage = (error) => {
  try {
    const body = error.response.body
    if (
      error.response.url.includes('api.github.com') &&
      typeof body === 'string'
    ) {
      const json = JSON.parse(body)
      if (json.message) {
        const message = json.message
        if (message.includes('rate limit exceeded')) {
          const reset = error.response.headers['x-ratelimit-reset']
          const limit = error.response.headers['x-ratelimit-limit']
          if (reset && typeof reset === 'string' && typeof limit === 'string') {
            const resetDate = new Date(parseInt(reset) * 1000)
            const limitAmount = parseInt(limit)
            return `GitHub rate limit of ${limitAmount} requests per hour execeeded, resets at ${resetDate}`
          }
        }
        return json.message
      }
    }
  } catch {}
  return `${error.message}`
}

const getReleases = async (repository) => {
  try {
    const json = await got(
      `https://api.github.com/repos/${repository}/releases`
    ).json()
    return json
  } catch (error) {
    if (error instanceof HTTPError) {
      const httpErrorMessage = getHttpErrorMessage(error)
      throw new VError(
        `Failed to get releases for ${repository}: ${httpErrorMessage}`
      )
    }
    // @ts-ignore
    throw new VError(error, `Failed to get releases for ${repository}`)
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

const updateBuiltinExtensions = async () => {
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
      Root.root,
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

const main = async () => {
  try {
    await updateBuiltinExtensions()
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.includes('rate limit')
    ) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

main()
