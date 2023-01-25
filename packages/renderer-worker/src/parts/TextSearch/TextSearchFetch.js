import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

const textSearchInFile = (file, content, query) => {
  const results = []
  const lines = content.split('\n')
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

export const textSearch = async (scheme, root, query, options) => {
  Assert.string(scheme)
  Assert.string(root)
  Assert.string(query)
  const assetDir = Platform.getAssetDir()
  const fetchUri = `${assetDir}/config/fileMap.json`
  const fileList = await Command.execute('Ajax.getJson', fetchUri)
  const allResults = []
  const relativeRoot = root.slice('fetch://'.length)
  for (const uri of fileList) {
    const fetchUri = `${assetDir}${uri}`
    const content = await Command.execute('Ajax.getText', fetchUri)
    const relativeUri = uri.slice(relativeRoot.length + 1)
    const results = textSearchInFile(relativeUri, content, query)
    allResults.push(...results)
  }
  return allResults
}
