import * as FileSystemDisk from '../FileSystem/FileSystemDisk.js'
import * as Workspace from '../Workspace/Workspace.js'

const join = (separator, left, right) => {
  return left.endsWith(separator) ? `${left}${right}` : `${left}${separator}${right}`
}

export const create = ({ error, fileSystemAccess, finishedAt, id, prompt, result, startedAt }) => {
  return {
    cwd: Workspace.getPath(),
    ...(error && { error }),
    finishedAt,
    id,
    messages: Array.isArray(result?.trace) ? result.trace : [],
    prompt,
    sessionId: typeof result?.sessionId === 'string' ? result.sessionId : '',
    ...(fileSystemAccess && { sandbox: { fileSystem: fileSystemAccess } }),
    status: error ? 'failed' : 'completed',
    task: result?.task || null,
    timestamp: startedAt,
    type: 'agent-trace',
    version: 1,
  }
}

export const createId = () => {
  return globalThis.crypto.randomUUID()
}

export const write = async (trace) => {
  const separator = await FileSystemDisk.getPathSeparator()
  const directory = join(separator, trace.cwd, '.agent-logs')
  const path = join(separator, directory, `trace-${trace.id}.json`)
  await FileSystemDisk.mkdir(directory)
  await FileSystemDisk.writeFile(path, JSON.stringify(trace, null, 2))
  return path
}
