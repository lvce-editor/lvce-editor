/**
 *
 * @param {any} error
 */
export const getHttpErrorMessage = (error) => {
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
