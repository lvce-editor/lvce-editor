import * as Command from '../Command/Command.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const writeFile = async (path, content) => {
  await Command.execute('FileSystem.writeFile', path, content)
}

export const mkdir = async (path) => {
  await Command.execute('FileSystem.mkdir', path)
}

export const getTmpDir = async ({ scheme = FileSystemProtocol.Memfs } = {}) => {
  switch (scheme) {
    case FileSystemProtocol.Memfs:
      return 'memfs:///workspace'
    default:
      return PlatformPaths.getTmpDir()
  }
}

export const chmod = async (uri, permissions) => {
  await Command.execute('FileSystem.chmod', uri, permissions)
}

export const createExecutable = async (content) => {
  const tmpDir = await getTmpDir({ scheme: 'file' })
  const nodePath = await PlatformPaths.getNodePath()
  const gitPath = `${tmpDir}/git`
  await writeFile(
    gitPath,
    `#!${nodePath}
  ${content}`,
  )
  await chmod(gitPath, '755')
  return gitPath
}

export const createExecutableFrom = async (path) => {
  const testPath = await PlatformPaths.getTestPath()
  const absolutePath = testPath + PathSeparatorType.Slash + path
  const content = await Command.execute('Ajax.getText', absolutePath)
  return createExecutable(content)
}
