import { VError } from '../VError/VError.js'

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    throw new VError(error, `Failed to import script ${url}`)
  }
}
