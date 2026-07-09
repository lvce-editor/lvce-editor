import { fileURLToPath } from 'node:url'

export const resolveBin = (name) => {
  try {
    const uri = import.meta.resolve(name)
    const path = fileURLToPath(uri)
    return path
  } catch {
    return ''
  }
}
