import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

export const writeFile = async (path, content) => {
  await Command.execute('FileSystem.writeFile', path, content)
}

export const mkdir = async (path) => {
  await Command.execute('FileSystem.mkdir', path)
}

export const getTmpDir = async ({ scheme = 'memfs' } = {}) => {
  switch (scheme) {
    case 'memfs':
      return 'memfs://'
    default:
      return Platform.getTmpDir()
  }
}

export const chmod = async (uri, permissions) => {
  await Command.execute('FileSystem.chmod', uri, permissions)
}

export const createExecutable = async (content) => {
  const tmpDir = await getTmpDir({ scheme: 'file' })
  const nodePath = await Platform.getNodePath()
  const gitPath = `${tmpDir}/git`
  await writeFile(
    gitPath,
    `#!${nodePath}
  ${content}`
  )
  await chmod(gitPath, '755')
  return gitPath
}

export const createExecutableFrom = async (path) => {
  const content = await Command.execute('FileSystem.readFile', path)
  return createExecutable(content)
}
