import VError from 'verror'

export const loadFile = async (path) => {
  try {
    const module = await import(path)
    return module
  } catch (error) {
    console.log({ error, code: error.code, name: error.name, stack: error.stack })
    throw new VError(error, `Failed to load ${path}`)
  }
}
