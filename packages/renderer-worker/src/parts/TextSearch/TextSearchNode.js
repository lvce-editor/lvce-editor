import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const textSearch = async (scheme, root, query, options) => {
  const result = await SharedProcess.invoke(
    /* Search.search */ 'TextSearch.search',
    /* folder */ root,
    /* searchTerm */ query,
    /* options */ options
  )
  // TODO api is weird
  return result.results
}
