import { readFile, writeFile } from 'node:fs/promises'
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

const formatCommands = async (relativePath) => {
  const absolutePath = join(root, relativePath)
  const content = await readFile(absolutePath, 'utf8')
  const lines = content.split('\n')
  const newLines = []
  let commandsIndex = -1
  for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i])
    if (lines[i].startsWith('export const Commands')) {
      commandsIndex = i
      break
    }
  }
  if (commandsIndex === -1) {
    throw new Error('Command start index not found')
  }
  let commandsEndIndex = -1
  for (let i = commandsIndex; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes('}')) {
      commandsEndIndex = i
      break
    }
  }
  if (commandsEndIndex === -1) {
    throw new Error('Command end index not found')
  }
  const middleLines = lines.slice(commandsIndex + 1, commandsEndIndex)
  const sortedLines = [...middleLines].sort()
  newLines.push(...sortedLines, ...lines.slice(commandsEndIndex))
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const formatAllCommands = async () => {
  for (const relativePath of [
    'packages/renderer-worker/src/parts/Window/Window.ipc.js',
  ]) {
    await formatCommands(relativePath)
  }
}

const main = async () => {
  await formatAllModuleIds()
  await formatAllCommands()
}

main()
