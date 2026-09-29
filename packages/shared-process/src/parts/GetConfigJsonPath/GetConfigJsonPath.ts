import { pathToFileURL } from 'node:url'
import * as Path from '../Path/Path.ts'

interface GetConfigJsonPathOptions {
  readonly getStaticPath: () => string
  readonly isBuiltServer: boolean
  readonly isProduction: boolean
  readonly root: string
}

export const getConfigJsonPath = ({ getStaticPath, isBuiltServer, isProduction, root }: GetConfigJsonPathOptions): string => {
  if (!isProduction) {
    return pathToFileURL(Path.join(root, 'static', 'config.json')).toString()
  }
  if (isBuiltServer) {
    return pathToFileURL(Path.join(getStaticPath(), '..', 'config.json')).toString()
  }
  return pathToFileURL(Path.join(root, 'config.json')).toString()
}
