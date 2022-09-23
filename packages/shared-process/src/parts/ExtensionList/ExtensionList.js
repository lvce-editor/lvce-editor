import { readdir } from 'fs/promises'
import * as Platform from '../Platform/Platform.js'

export const list = async () => {
  const extensionPath = Platform.getExtensionsPath()
  const dirents = await readdir(extensionPath)
  return []
}
