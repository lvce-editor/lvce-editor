import VError from 'verror'

export const loadFile = async (path) => {
  try {
    const module = await import(path)
    return module
  } catch (error) {
    throw new VError(error, `Failed to load ${path}`)
  }
}
