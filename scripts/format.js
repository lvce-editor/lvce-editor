import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..')

const sort = (array) => {
  return [...array].sort()
}

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
    'packages/renderer-worker/src/parts/ModuleId/ModuleId.js',
    'packages/shared-process/src/parts/ModuleId/ModuleId.js',
    'packages/main-process/src/parts/ModuleId/ModuleId.js',
  ]) {
    await formatModuleIds(relativePath)
  }
}

const formatViewletModuleIds = async (relativePath) => {
  const absolutePath = join(root, relativePath)
  const content = await readFile(absolutePath, 'utf8')
  const lines = content.split('\n')
  const map = Object.create(null)
  for (const line of lines) {
    if (line.includes('export const ')) {
      const equalSignIndex = line.indexOf('=')
      const stringStartIndex = line.indexOf("'", equalSignIndex)
      const stringEndIndex = line.indexOf("'", stringStartIndex + 1)
      const key = line.slice('export const '.length, equalSignIndex).trim()
      const value = line.slice(stringStartIndex, stringEndIndex + 1)
      map[key] = value
    }
  }
  const keys = Object.keys(map)
  const sortedKeys = sort(keys)
  const newLines = []
  for (const key of sortedKeys) {
    const value = map[key]
    newLines.push(`export const ${key} = ${value}\n`)
  }
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const formatAllViewletModuleIds = async () => {
  const allViewletModuleIdFiles = [
    'packages/renderer-worker/src/parts/ViewletModuleId/ViewletModuleId.js',
    'packages/renderer-process/src/parts/ViewletModuleId/ViewletModuleId.js',
  ]
  for (const path of allViewletModuleIdFiles) {
    await formatViewletModuleIds(path)
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
  const sortedLines = sort(middleLines)
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

const formatModuleMap = async (absolutePath) => {
  const content = await readFile(absolutePath, 'utf8')
  const lines = content.split('\n')
  const newLines = []
  let i = 1
  const State = {
    Top: 0,
    Switch: 1,
    Case: 2,
    Return: 3,
    Default: 4,
    Bottom: 5,
  }
  let state = State.Top
  const moduleMap = Object.create(null)
  let commandIds = []
  outer: for (const line of lines) {
    const trimmedLine = line.trimStart()
    if (trimmedLine.startsWith('switch')) {
      state = State.Switch
    } else if (trimmedLine.startsWith('case')) {
      state = State.Case
    } else if (trimmedLine.startsWith('return')) {
      state = State.Return
    } else if (trimmedLine.startsWith('default')) {
      state = State.Default
    } else {
      state = State.Top
    }
    switch (state) {
      case State.Case:
        const caseIndex = line.indexOf('case')
        const commandId = line.slice(caseIndex + 'case'.length + 1, -1)
        commandIds.push(commandId)
        break
      case State.Return:
        const returnIndex = line.indexOf('return')
        const moduleId = line.slice(returnIndex + 'return'.length + 1)
        moduleMap[moduleId] = commandIds
        commandIds = []
        break
      case State.Top:
        newLines.push(line)
        break
      case State.Switch:
        newLines.push(line)
        break
      case State.Default:
        break outer
      default:
        break
    }
  }
  const keys = Object.keys(moduleMap)
  const sortedKeys = sort(keys)
  for (const key of sortedKeys) {
    const commandIds = moduleMap[key]
    const sortedCommandsIds = sort(commandIds)
    for (const commandId of sortedCommandsIds) {
      newLines.push(`    case ${commandId}:`)
    }
    newLines.push(`      return ${key}`)
  }
  newLines.push(`    default:`)
  newLines.push(`      throw new Error(\`command \${commandId} not found\`)`)
  newLines.push(`  }`)
  newLines.push(`}`)
  newLines.push(``)
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const formatAllModuleMaps = async () => {
  const moduleMapPaths = [
    'packages/renderer-process/src/parts/ModuleMap/ModuleMap.js',
    'packages/shared-process/src/parts/ModuleMap/ModuleMap.js',
    'packages/renderer-worker/src/parts/ModuleMap/ModuleMap.js',
  ]
  for (const moduleMapPath of moduleMapPaths) {
    const absolutePath = join(root, moduleMapPath)
    await formatModuleMap(absolutePath)
  }
}

const formatModuleFile = async (absolutePath) => {
  const content = await readFile(absolutePath, 'utf8')
  const lines = content.split('\n')
  const newLines = []
  let i = 1
  const State = {
    Top: 0,
    Switch: 1,
    Case: 2,
    Return: 3,
    Default: 4,
    Bottom: 5,
  }
  let state = State.Top
  const moduleMap = Object.create(null)
  let commandIds = []
  outer: for (const line of lines) {
    const trimmedLine = line.trimStart()
    if (trimmedLine.startsWith('switch')) {
      state = State.Switch
    } else if (trimmedLine.startsWith('case')) {
      state = State.Case
    } else if (trimmedLine.startsWith('return')) {
      state = State.Return
    } else if (trimmedLine.startsWith('default')) {
      state = State.Default
    } else {
      state = State.Top
    }
    switch (state) {
      case State.Case:
        const caseIndex = line.indexOf('case')
        const commandId = line.slice(caseIndex + 'case'.length + 1, -1)
        commandIds.push(commandId)
        break
      case State.Return:
        const returnIndex = line.indexOf('return')
        const moduleId = line.slice(returnIndex + 'return'.length + 1)
        moduleMap[moduleId] = commandIds
        commandIds = []
        break
      case State.Top:
        newLines.push(line)
        break
      case State.Switch:
        newLines.push(line)
        break
      case State.Default:
        break outer
      default:
        break
    }
  }
  const keys = Object.keys(moduleMap)
  const sortedKeys = sort(keys)
  for (const key of sortedKeys) {
    const commandIds = moduleMap[key]
    const sortedCommandsIds = sort(commandIds)
    for (const commandId of sortedCommandsIds) {
      newLines.push(`    case ${commandId}:`)
    }
    newLines.push(`      return ${key}`)
  }
  newLines.push(`    default:`)
  newLines.push(`      throw new Error(\`module \${moduleId} not found\`)`)
  newLines.push(`  }`)
  newLines.push(`}`)
  newLines.push(``)
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await writeFile(absolutePath, newContent)
  }
}

const formatAllModuleFiles = async () => {
  const moduleFiles = [
    'packages/shared-process/src/parts/Module/Module.js',
    'packages/main-process/src/parts/Module/Module.js',
    'packages/renderer-process/src/parts/Module/Module.js',
    'packages/renderer-worker/src/parts/Module/Module.js',
  ]
  for (const moduleFile of moduleFiles) {
    const absolutePath = join(root, moduleFile)
    await formatModuleFile(absolutePath)
  }
}

const main = async () => {
  await formatAllViewletModuleIds()
  await formatAllModuleFiles()
  await formatAllModuleMaps()
  await formatAllModuleIds()
  await formatAllCommands()
}

main()
