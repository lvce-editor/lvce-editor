import { removeQueryParameters } from '../RemoveQueryParameters/RemoveQueryParameters.js'

export const isTypeScriptPath = (uri) => {
  const pathName = removeQueryParameters(uri)
  return pathName.endsWith('.ts')
}
