import { removeQueryParameters } from '../RemoveQueryParameters/RemoveQueryParameters.ts'

export const isTypeScriptPath = (uri: any): any => {
  const pathName = removeQueryParameters(uri)
  return pathName.endsWith('.ts')
}
