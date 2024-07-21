import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const writeFile = async (path: string, content: string) => {
  await Rpc.invoke('FileSystem.writeFile', path, content)
}

export const mkdir = async (path: string) => {
  await Rpc.invoke('FileSystem.mkdir', path)
}

export const getTmpDir = async ({ scheme = FileSystemProtocol.Memfs } = {}) => {
  switch (scheme) {
    case FileSystemProtocol.Memfs:
      return 'memfs:///workspace'
    default:
      return Rpc.invoke('PlatformPaths.getTmpDir')
  }
}

export const chmod = async (uri: string, permissions: any) => {
  await Rpc.invoke('FileSystem.chmod', uri, permissions)
}

export const createExecutable = async (content: string) => {
  const tmpDir = await getTmpDir({ scheme: 'file' })
  const nodePath = await Rpc.invoke('PlatformPaths.getNodePath')
  const gitPath = `${tmpDir}/git`
  await writeFile(
    gitPath,
    `#!${nodePath}
  ${content}`,
  )
  await chmod(gitPath, '755')
  return gitPath
}

export const createExecutableFrom = async (path: string) => {
  const testPath = await Rpc.invoke('PlatformPaths.getTestPath')
  const absolutePath = testPath + PathSeparatorType.Slash + path
  const content = await Rpc.invoke('Ajax.getText', absolutePath)
  return createExecutable(content)
}
