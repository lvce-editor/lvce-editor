import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..')

const formatModuleIds = async (relativePath) => {
  const absolutePath = join(root, relativePath)
  const content = await readFile(absolutePath, 'utf8')
  const lines = content.split('\n')
  const newLines = []
  let i = 1
  for (const line of lines) {
    const equalSignIndex = line.indexOf('=')
    if (equalSignIndex === -1) {
      newLines.push(line)
    } else {
      const before = line.slice(0, equalSignIndex)
      const after = `= ${i++}`
      const newLine = before + after
      newLines.push(newLine)
    }
  }
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const formatAllModuleIds = async () => {
  for (const relativePath of [
    'packages/renderer-process/src/parts/ModuleId/ModuleId.js',
    'packages/shared-process/src/parts/ModuleId/ModuleId.js',
    'packages/main-process/src/parts/ModuleId/ModuleId.js',
  ]) {
    await formatModuleIds(relativePath)
  }
}

const formatCommands = async (absolutePath) => {
  const content = await readFile(absolutePath, 'utf8')
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
    console.warn(`Command start index not found in ${absolutePath}`)
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
  const sortedLines = [...middleLines].sort()
  newLines.push(...sortedLines, ...lines.slice(commandsEndIndex))
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const getIpcFiles = async (...roots) => {
  const allIpcFiles = []
  const getIpcFilesInternal = async (root) => {
    const dirents = await readdir(root, { withFileTypes: true })
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const folderPath = join(root, dirent.name)
        await getIpcFilesInternal(folderPath)
      } else if (dirent.isFile() && dirent.name.endsWith('.ipc.js')) {
        allIpcFiles.push(join(root, dirent.name))
      }
    }
  }
  for (const relativePath of roots) {
    const absoluteRoot = join(root, relativePath)
    await getIpcFilesInternal(absoluteRoot)
  }
  return allIpcFiles
}

const formatAllCommands = async () => {
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

const main = async () => {
  await formatAllModuleIds()
  await formatAllCommands()
}

main()
