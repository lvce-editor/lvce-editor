import * as Arrays from '../Arrays/Arrays.js'
import * as Path from '../Path/Path.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const formatCommands = async (absolutePath) => {
  const content = await ReadFile.readFile(absolutePath)
  const lines = content.split('\n')
  const newLines = []
  let commandsIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    newLines.push(line)
    if (
      line.startsWith('export const Commands') ||
      line.startsWith('exports.Commands')
    ) {
      commandsIndex = i
      break
    }
  }
  if (commandsIndex === -1) {
    return
  }
  let commandsEndIndex = -1
  for (let i = commandsIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes('}')) {
      commandsEndIndex = i
      break
    }
  }
  if (commandsEndIndex === -1) {
    return
  }
  const middleLines = lines.slice(commandsIndex + 1, commandsEndIndex)
  const sortedLines = Arrays.sort(middleLines)
  newLines.push(...sortedLines, ...lines.slice(commandsEndIndex))
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await WriteFile.writeFile({
      to: absolutePath,
      content: newContent,
    })
  }
}

const getIpcFiles = async (...roots) => {
  const allIpcFiles = []
  const getIpcFilesInternal = async (root) => {
    const dirents = await ReadDir.readDir(root)
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const folderPath = Path.join(root, dirent.name)
        await getIpcFilesInternal(folderPath)
      } else if (dirent.isFile() && dirent.name.endsWith('.ipc.js')) {
        allIpcFiles.push(Path.join(root, dirent.name))
      }
    }
  }
  for (const relativePath of roots) {
    const absoluteRoot = Path.join(Root.root, relativePath)
    await getIpcFilesInternal(absoluteRoot)
  }
  return allIpcFiles
}

export const formatAllCommands = async () => {
  const allIpcFiles = await getIpcFiles(
    'packages/shared-process/src',
    'packages/renderer-process/src',
    'packages/renderer-worker/src',
    'packages/main-process/src'
  )
  for (const path of allIpcFiles) {
    await formatCommands(path)
  }
}
