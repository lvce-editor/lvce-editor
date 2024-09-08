import * as Assert from '../Assert/Assert.ts'
import * as LoadKy from '../LoadKy/LoadKy.js'
import { VError } from '../VError/VError.js'

export const getJson = async (url, options = {}) => {
  try {
    Assert.string(url)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const result = await response.json()
    return result
  } catch (error) {
    if (error && error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new VError(`Failed to request json from "${url}". Make sure that the server is running and has CORS enabled`)
    }
    // @ts-ignore
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
    const { default: ky } = await LoadKy.loadKy()
    return await ky(url, options).text()
  } catch (error) {
    if (error && error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new VError(error, `Failed to request text from "${url}". Make sure that the server is running and has CORS enabled`)
    }
    throw new VError(error, `Failed to request text from "${url}"`)
  }
}

export const getBlob = async (url, options = {}) => {
  try {
    const { default: ky } = await LoadKy.loadKy()
    return await ky(url, options).blob()
  } catch (error) {
    throw new VError(error, `Failed to request blob from "${url}"`)
  }
}

export const getResponse = async (url, options) => {
  try {
    const { default: ky } = await LoadKy.loadKy()
    return await ky(url, options)
  } catch (error) {
    throw new VError(error, `Failed to request response from "${url}"`)
  }
}
