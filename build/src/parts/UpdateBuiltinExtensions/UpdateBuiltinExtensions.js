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

const parseVersionFromUrl = (url) => {
  if (!url.includes('releases/tag')) {
    throw new Error(`cannot parse release version from url ${url}`)
  }
  const slashIndex = url.lastIndexOf('/')
  const version = url.slice(slashIndex + 1)
  if (version.startsWith('v')) {
    return version.slice(1)
  }
  return version
}

const getLatestReleaseVersion = async (repository) => {
  try {
    const json = await got.head(
      `https://github.com/${repository}/releases/latest`
    )
    const finalUrl = json.url
    const version = parseVersionFromUrl(finalUrl)
    return version
  } catch (error) {
    if (error instanceof HTTPError) {
      const httpErrorMessage = getHttpErrorMessage(error)
      throw new VError(
        `Failed to get latest release for ${repository}: ${httpErrorMessage}`
      )
    }
    // @ts-ignore
    throw new VError(error, `Failed to get latest release for ${repository}`)
  }
}

const getDiffCount = (arrayA, arrayB) => {
  const length = arrayA.length
  let diffCount = 0
  for (let i = 0; i < length; i++) {
    if (arrayA[i].version !== arrayB[i].version) {
      diffCount++
    }
  }
  return diffCount
}

const getNewBuiltinExtensions = (builtinExtensions, versions) => {
  const newBuiltinExtensions = []
  for (let i = 0; i < builtinExtensions.length; i++) {
    const extension = builtinExtensions[i]
    newBuiltinExtensions.push({
      ...extension,
      version: versions[i],
    })
  }
  return newBuiltinExtensions
}

const updateBuiltinExtensions = async () => {
  const start = performance.now()
  const repositories = builtinExtensions.map(getName).map(getRepository)
  const newVersions = await Promise.all(
    repositories.map(getLatestReleaseVersion)
  )
  const newBuiltinExtensions = getNewBuiltinExtensions(
    builtinExtensions,
    newVersions
  )
  const end = performance.now()
  const duration = end - start
  const diffCount = getDiffCount(builtinExtensions, newBuiltinExtensions)
  if (diffCount === 0) {
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
      JSON.stringify(newBuiltinExtensions, null, 2) + '\n'
    )
    // TODO print which releases were updated
    if (diffCount === 1) {
      console.info(`updated ${diffCount} release in ${duration}ms`)
    } else {
      console.info(`updated ${diffCount} releases in ${duration}ms`)
    }
    await import('../DownloadBuiltinExtensions/DownloadBuiltinExtensions.js')
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
