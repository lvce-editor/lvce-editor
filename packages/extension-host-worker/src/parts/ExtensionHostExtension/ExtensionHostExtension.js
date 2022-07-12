import * as Assert from '../Assert/Assert.js'

const getAbsolutePath = (path, relativePath) => {
  if (path.endsWith('/')) {
    return new URL(relativePath, path).toString()
  }
  return new URL(relativePath, path + '/').toString()
}

export const activate = async (extension) => {
  // console.log('activating ', path)
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = getAbsolutePath(extension.path, extension.browser)
    console.log({
      browser: extension.browser,
      path: extension.path,
      absolutePath,
    })
    const module = await import(absolutePath)
    await module.activate()
  } catch (error) {
    throw new Error(`Failed to activate extension`, {
      // @ts-ignore
      cause: error,
    })
  }
  // console.info('activated', path)
}
