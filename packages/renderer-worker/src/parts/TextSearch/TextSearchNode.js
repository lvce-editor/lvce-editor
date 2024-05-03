import * as GetTextSearchRipGrepArgs from '../GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'
import * as SearchProcess from '../SearchProcess/SearchProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const textSearch = async (scheme, root, query, options) => {
  const ripGrepArgs = GetTextSearchRipGrepArgs.getRipGrepArgs({
    ...options,
    searchString: query,
  })
  const actualOptions = {
    ripGrepArgs,
    searchDir: root,
  }
  const result = await SearchProcess.invoke(SharedProcessCommandType.TextSearchSearch, actualOptions)
  // TODO api is weird
  return result.results
}
