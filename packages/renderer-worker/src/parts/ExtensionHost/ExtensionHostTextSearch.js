import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'
import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'

const FILE_RESULT = 1
const MATCH_RESULT = 2
const USE_REGULAR_EXPRESSION = 1 << 1
const MATCH_WHOLE_WORD = 1 << 3
const MATCH_CASE = 1 << 4

const getLineMatch = (line, lineNumber, query, flags) => {
  if (flags & USE_REGULAR_EXPRESSION) {
    const regex = new RegExp(query, flags & MATCH_CASE ? '' : 'i')
    const match = line.match(regex)
    return match && typeof match.index === 'number'
      ? [{ end: match.index + match[0].length, lineNumber, start: match.index, text: line, type: MATCH_RESULT }]
      : []
  }
  const source = flags & MATCH_CASE ? line : line.toLowerCase()
  const needle = flags & MATCH_CASE ? query : query.toLowerCase()
  const index = source.indexOf(needle)
  if (index < 0) {
    return []
  }
  if (flags & MATCH_WHOLE_WORD) {
    const before = line[index - 1]
    const after = line[index + query.length]
    if ((before && /[\p{L}\p{N}_]/u.test(before)) || (after && /[\p{L}\p{N}_]/u.test(after))) {
      return []
    }
  }
  return [{ end: index + query.length, lineNumber, start: index, text: line, type: MATCH_RESULT }]
}

const searchText = (file, content, query, flags = 0) => {
  const matches = content.split(/\r?\n/).flatMap((line, index) => getLineMatch(line, index, query, flags))
  return matches.length === 0 ? [] : [{ end: 0, lineNumber: 0, start: 0, text: file, type: FILE_RESULT }, ...matches]
}

export const executeTextSearchProvider = async (scheme) => {
  throw new Error(`No isolated text search provider found for ${scheme}`)
}

export const textSearchFetch = async (scheme, root, query, options, assetDir) => {
  const response = await fetch(`${assetDir}/config/fileMap.json`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const fileList = await response.json()
  const relativeRoot = root.slice('fetch://'.length)
  const results = []
  for (const uri of fileList) {
    const fileResponse = await fetch(`${assetDir}${uri}`)
    const content = await fileResponse.text()
    results.push(...searchText(uri.slice(relativeRoot.length + 1), content, query, options.flags || 0))
  }
  return results
}

const searchHtmlDirectory = async (uri, relativePath, query, flags, results) => {
  const entries = await FileSystemHtml.readDirWithFileTypes(uri)
  for (const entry of entries) {
    const childUri = `${uri}/${entry.name}`
    const childRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name
    if (entry.type === DirentType.Directory) {
      await searchHtmlDirectory(childUri, childRelativePath, query, flags, results)
    } else {
      const content = await FileSystemHtml.readFile(childUri)
      results.push(...searchText(childRelativePath, content, query, flags))
    }
  }
}

export const textSearchHtml = async (scheme, root, query, options = {}) => {
  const results = []
  await searchHtmlDirectory(root, '', query, options.flags || 0, results)
  return results
}

export const textSearchMemory2 = async (scheme, root, query, options = {}) => {
  const relativeRoot = root.slice('memfs://'.length)
  const allResults = []
  for (const [path, value] of Object.entries(FileSystemMemory.getFiles())) {
    if (value.type !== DirentType.File || !path.startsWith(relativeRoot)) {
      continue
    }
    if (options.include && !path.includes(options.include)) {
      continue
    }
    if (options.exclude && path.includes(options.exclude)) {
      continue
    }
    const relativePath = path.slice(relativeRoot.length).replace(/^\//, '')
    allResults.push(...searchText(relativePath, value.content, query, options.flags || 0))
  }
  return {
    limitHit: Boolean(options.limit && allResults.length > options.limit),
    results: options.limit ? allResults.slice(0, options.limit) : allResults,
  }
}

export const textSearchMemory = async (...args) => {
  const { results } = await textSearchMemory2(...args)
  return results
}
