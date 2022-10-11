import * as Arrays from '../Arrays/Arrays.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const formatModuleFile = async (absolutePath) => {
  const content = await ReadFile.readFile(absolutePath)
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
  const sortedKeys = Arrays.sort(keys)
  for (const key of sortedKeys) {
    const commandIds = moduleMap[key]
    const sortedCommandsIds = Arrays.sort(commandIds)
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
    await WriteFile.writeFile({
      to: absolutePath,
      content: newContent,
    })
  }
}

export const formatAllModuleFiles = async () => {
  const moduleFiles = [
    'packages/shared-process/src/parts/Module/Module.js',
    'packages/main-process/src/parts/Module/Module.js',
    'packages/renderer-process/src/parts/Module/Module.js',
    'packages/renderer-worker/src/parts/Module/Module.js',
  ]
  for (const moduleFile of moduleFiles) {
    const absolutePath = Path.join(Root.root, moduleFile)
    await formatModuleFile(absolutePath)
  }
}
