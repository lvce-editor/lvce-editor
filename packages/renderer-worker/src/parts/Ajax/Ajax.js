import ky, { HTTPError } from '../../../../../static/js/ky.js'

export const state = {
  async getJson(url, options) {
    // cannot use ky(url).json() because it sets "accept: application/json"
    // which doesn't work with preload, see
    // https://stackoverflow.com/questions/41655955/why-are-preload-link-not-working-for-json-requests#answer-48645748
    const response = await ky(url, options)
    return response.json()
  },
  async getText(url, options) {
    return ky(url, options).text()
  },
}

/**
 * @throws
 */
export const getJson = async (url, options = {}) => {
  try {
    const result = await state.getJson(url, options)
    return result
  } catch (error) {
    if (
      error &&
      error instanceof TypeError &&
      error.message === 'Failed to fetch'
    ) {
      throw new Error(
        `Failed to request json from "${url}". Make sure that the server has CORS enabled`,
        {
          cause: error,
        }
      )
    }
    if (error && error instanceof HTTPError) {
      let json
      try {
        json = await error.response.json()
      } catch {
        throw error
      }
      if (json && json.message) {
        throw new Error(`Failed to request json from "${url}": ${json.message}`)
      }
    }
    error.message = `Failed to request json from "${url}": ${error.message}`
    throw error
  }
}

export const getJsonLocal = (url) => {
  return getJson(url, {
    mode: 'no-cors',
  })
}

export const getText = async (url, options = {}) => {
  try {
    const result = await state.getText(url, options)
    return result
  } catch (error) {
    if (
      error &&
      error instanceof TypeError &&
      error.message === 'Failed to fetch'
    ) {
      throw new Error(
        `Failed to request text from "${url}". Make sure that the server has CORS enabled`,
        {
          cause: error,
        }
      )
    }
    throw new Error(`Failed to request text from "${url}"`, { cause: error })
  }
}
