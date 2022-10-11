import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Root from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const formatModuleIds = async (relativePath) => {
  const absolutePath = Path.join(Root.root, relativePath)
  const content = await ReadFile.readFile(absolutePath)
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
    await WriteFile.writeFile({
      to: absolutePath,
      content: newContent,
    })
  }
}

export const formatAllModuleIds = async () => {
  for (const relativePath of [
    'packages/renderer-process/src/parts/ModuleId/ModuleId.js',
    'packages/renderer-worker/src/parts/ModuleId/ModuleId.js',
    'packages/shared-process/src/parts/ModuleId/ModuleId.js',
    'packages/main-process/src/parts/ModuleId/ModuleId.js',
  ]) {
    await formatModuleIds(relativePath)
  }
}
