import { DepecratedError } from '../DepecratedError/DeprecatedError.ts'

export const getJson = async (url) => {
  throw new DepecratedError(`vscode.getJson is deprecated, use createNodeRpc instead`)
}
