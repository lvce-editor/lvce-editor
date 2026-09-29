import { fileURLToPath } from 'node:url'

export const resolveBin = (name: any): any => {
  try {
    const uri = import.meta.resolve(name)
    const path = fileURLToPath(uri)
    return path
  } catch {
    return ''
  }
}
