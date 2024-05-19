import * as Assert from '../Assert/Assert.ts'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as TextSearchProvider from '../TextSearchProvider/TextSearchProvider.js'
import * as SearchWorker from '../SearchWorker/SearchWorker.js'

export const textSearch = async (root, query, options) => {
  return SearchWorker.invoke('TextSearch.textSearch', root, query, options)
  Assert.string(root)
  Assert.string(query)
  const scheme = GetProtocol.getProtocol(root)
  const provider = await TextSearchProvider.getProvider(scheme)
  const results = await provider.textSearch(scheme, root, query, options)
  return results
}

export const cancel = async (searchId) => {
  // TODO
  // await SharedProcess.invoke(
  //   /* Search.cancel */ 'Search.cancel',
  //   /* searchId */ state.searchId
  // )
}
