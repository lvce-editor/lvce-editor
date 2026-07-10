import * as Path from '../Path/Path.ts'
import * as ReadFile from '../ReadFile/ReadFile.ts'
import * as Root from '../Root/Root.ts'
import * as WriteFile from '../WriteFile/WriteFile.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const formatModuleIds = async (relativePath) => {
  const absolutePath = Path.join(Root.root, relativePath)
  const content = await ReadFile.readFile(absolutePath)
  const lines = SplitLines.splitLines(content)
  const newLines: any[] = []
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
    'packages/shared-process/src/parts/ModuleId/ModuleId.ts',
    'packages/main-process/src/parts/ModuleId/ModuleId.cjs',
  ]) {
    await formatModuleIds(relativePath)
  }
}
