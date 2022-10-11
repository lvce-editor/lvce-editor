import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as Arrays from '../Arrays/Arrays.js'

const formatViewletModuleIds = async (relativePath) => {
  const absolutePath = Path.join(Root.root, relativePath)
  const content = await ReadFile.readFile(absolutePath)
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
  const sortedKeys = Arrays.sort(keys)
  const newLines = []
  for (const key of sortedKeys) {
    const value = map[key]
    newLines.push(`export const ${key} = ${value}\n`)
  }
  const newContent = newLines.join('\n')
  if (content !== newContent) {
    await WriteFile.writeFile({
      to: absolutePath,
      content: newContent,
    })
  }
}

export const formatAllViewletModuleIds = async () => {
  const allViewletModuleIdFiles = [
    'packages/renderer-worker/src/parts/ViewletModuleId/ViewletModuleId.js',
    'packages/renderer-process/src/parts/ViewletModuleId/ViewletModuleId.js',
  ]
  for (const path of allViewletModuleIdFiles) {
    await formatViewletModuleIds(path)
  }
}
