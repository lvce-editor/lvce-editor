import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const textSearch = async (scheme, root, query) => {
  const result = await SharedProcess.invoke(
    /* Search.search */ 'Search.search',
    /* folder */ root,
    /* searchTerm */ query
  )
  // TODO api is weird
  return result.results
}
