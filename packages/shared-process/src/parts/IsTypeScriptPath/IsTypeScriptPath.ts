import { removeQueryParameters } from '../RemoveQueryParameters/RemoveQueryParameters.ts'

export const isTypeScriptPath = (uri) => {
  const pathName = removeQueryParameters(uri)
  return pathName.endsWith('.ts')
}
