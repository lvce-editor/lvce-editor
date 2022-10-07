import * as Assert from '../Assert/Assert.js'

const getAbsolutePath = (path, relativePath, origin) => {
  if (path.startsWith('http')) {
    if (path.endsWith('/')) {
      return new URL(relativePath, path).toString()
    }
    return new URL(relativePath, path + '/').toString()
  }
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  console.log({ path })
  return new URL('/remote' + path + '/' + relativePath, origin).toString()
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
  console.log('activating ', extension)
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = getAbsolutePath(
      extension.path,
      extension.browser,
      location.origin
    )
    const module = await import(absolutePath)
    await module.activate()
  } catch (error) {
    const id = getId(extension)
    throw new Error(`Failed to activate extension ${id}: ${error}`)
  }
  // console.info('activated', path)
}
