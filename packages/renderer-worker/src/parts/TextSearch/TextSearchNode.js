import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const textSearch = async (scheme, root, query, options) => {
  const result = await SharedProcess.invoke(
    SharedProcessCommandType.TextSearchSearch,
    /* folder */ root,
    /* searchTerm */ query,
    /* options */ options
  )
  // TODO api is weird
  return result.results
}
