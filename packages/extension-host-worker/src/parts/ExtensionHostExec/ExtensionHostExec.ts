import { DepecratedError } from '../DepecratedError/DeprecatedError.ts'

export const exec = async (command, args, options) => {
  throw new DepecratedError(`vscode.exec is deprecated, use createNodeRpc instead`)
}
