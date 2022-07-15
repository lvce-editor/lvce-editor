import * as Assert from '../Assert/Assert.js'

const getAbsolutePath = (path, relativePath) => {
  if (path.endsWith('/')) {
    return new URL(relativePath, path).toString()
  }
  return new URL(relativePath, path + '/').toString()
}

const baseName = (path) => {
  const slashIndex = path.lastIndexOf('/')
  return path.slice(slashIndex + 1)
}

const getId = (extension) => {
  if (extension && extension.id) {
    return extension.id
  }
  if (extension && extension.path) {
    return baseName(extension.path)
  }
  return '<unknown>'
}

export const activate = async (extension) => {
  // console.log('activating ', path)
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = getAbsolutePath(extension.path, extension.browser)
    const module = await import(absolutePath)
    await module.activate()
  } catch (error) {
    const id = getId(extension)
    throw new Error(`Failed to activate extension ${id}: ${error}`)
  }
  // console.info('activated', path)
}
