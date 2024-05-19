import * as GetTextSearchRipGrepArgs from '../GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.ts'
// import * as SearchProcess from '../SearchProcess/SearchProcess.js'
// import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'


const SearchProcess = {
  // TODO connect to search process
  invoke() {
    return {
      results: []
    }
  }
}

export const textSearch = async (scheme, root, query, options) => {
  const ripGrepArgs = GetTextSearchRipGrepArgs.getRipGrepArgs({
    ...options,
    searchString: query,
  })
  const actualOptions = {
    ripGrepArgs,
    searchDir: root,
  }
  // @ts-ignore
  const result = await SearchProcess.invoke(SharedProcessCommandType.TextSearchSearch, actualOptions)
  // TODO api is weird
  return result.results
}
