const { default: got, HTTPError } = require('got')
const VError = require('verror')

/**
 *
 * @param {HTTPError} error
 */
const getHttpErrorMessage = (error) => {
  try {
    const body = error.response.body
    if (error.response.url.includes('api.github.com') && typeof body === 'string') {
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

const parseVersionFromUrl = (url, repository) => {
  if (!url.includes('releases/tag')) {
    if (url.endsWith('/releases')) {
      throw new Error(`no releases found for ${repository}`)
    }
    throw new Error(`cannot parse release version from url ${url}`)
  }
  const slashIndex = url.lastIndexOf('/')
  const version = url.slice(slashIndex + 1)
  if (version.startsWith('v')) {
    return version.slice(1)
  }
  return version
}

exports.getLatestReleaseVersion = async (repository) => {
  try {
    const json = await got.head(`https://github.com/${repository}/releases/latest`)
    const finalUrl = json.url
    const version = parseVersionFromUrl(finalUrl, repository)
    return version
  } catch (error) {
    if (error instanceof HTTPError) {
      const httpErrorMessage = getHttpErrorMessage(error)
      throw new VError(`Failed to get latest release for ${repository}: ${httpErrorMessage}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to get latest release for ${repository}`)
  }
}
