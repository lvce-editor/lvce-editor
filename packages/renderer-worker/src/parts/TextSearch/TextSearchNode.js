import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const textSearch = async (scheme, root, query, startIndex, endIndex) => {
  const result = await SharedProcess.invoke(
    /* Search.search */ 'Search.search',
    /* folder */ root,
    /* searchTerm */ query,
    /* startIndex */ startIndex,
    /* endIndex */ endIndex
  )
  // TODO api is weird
  return {
    results: result.results,
    fileCount: result.fileCount,
    resultCount: result.resultCount,
  }
}

export const getRangedResults = async (scheme, startIndex, endIndex) => {
  const result = await SharedProcess.invoke(
    /* Search.getRangedResults */ 'Search.getRangedResults',
    /* startIndex */ startIndex,
    /* endIndex */ endIndex
  )
  return result
}
