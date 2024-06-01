import * as AssetDir from '../AssetDir/AssetDir.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as Response from '../Response/Response.js'
import { VError } from '../VError/VError.js'

export const getCss = async (relativePath) => {
  try {
    const url = `${AssetDir.assetDir}${relativePath}`
    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === HttpStatusCode.NotFound) {
        throw new Error(`File not found ${url}`)
      }
      throw new Error(response.statusText)
    }
    const text = await Response.getText(response)
    return text
  } catch (error) {
    throw new VError(error, `Failed to load css "${relativePath}"`)
  }
}
