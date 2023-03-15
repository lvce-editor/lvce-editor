import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as BrowserErrorTypes from '../BrowserErrorTypes/BrowserErrorTypes.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'
import * as FileSystemFileHandle from '../FileSystemFileHandle/FileSystemFileHandle.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import { VError } from '../VError/VError.js'

const getDirectoryHandle = async (uri) => {
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname('/', uri)
  if (uri === dirname) {
    return undefined
  }
  return getDirectoryHandle(dirname)
}

const textSearchInText = (file, content, query) => {
  const results = []
  const lines = SplitLines.splitLines(content)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const index = line.indexOf(query)
    if (index !== -1) {
      results.push({
        type: TextSearchResultType.Match,
        text: line,
        start: index,
        end: index + query.length,
        lineNumber: i,
      })
    }
  }
  if (results.length !== 0) {
    results.unshift({
      type: TextSearchResultType.File,
      text: file,
      start: 0,
      end: 0,
      lineNumber: 0,
    })
  }
  return results
}

const textSearchInFile = async (all, handle, absolutePath, query) => {
  try {
    const file = await FileSystemFileHandle.getFile(handle)
    const content = await file.text()
    const results = textSearchInText(absolutePath, content, query)
    Arrays.push(all, results)
  } catch (error) {
    if (BrowserErrorTypes.isNotReadableError(error)) {
      // ignore
      return
    }
    throw error
  }
}

const textSearchRecursively = async (all, parent, handle, query) => {
  const childHandles = await FileSystemHtml.getChildHandles(handle)
  const promises = []
  for (const childHandle of childHandles) {
    const absolutePath = parent + '/' + childHandle.name
    switch (childHandle.kind) {
      case FileHandleType.Directory:
        promises.push(textSearchRecursively(all, absolutePath, childHandle, query))
        break
      case FileHandleType.File:
        promises.push(textSearchInFile(all, childHandle, absolutePath, query))
        break
      default:
        break
    }
  }
  await Promise.all(promises)
}

export const textSearch = async (scheme, root, query) => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const relativeRoot = root.slice('html://'.length)
  const handle = await getDirectoryHandle(relativeRoot)
  if (!handle) {
    throw new VError(`Folder not found ${relativeRoot}`)
  }
  const all = []
  await textSearchRecursively(all, '', handle, query)
  return all
}
