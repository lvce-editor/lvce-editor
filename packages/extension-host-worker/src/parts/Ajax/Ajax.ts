import * as LoadKy from '../LoadKy/LoadKy.js'
import { VError } from '../VError/VError.js'

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
