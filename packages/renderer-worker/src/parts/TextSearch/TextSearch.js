import * as Assert from '../Assert/Assert.ts'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const textSearch = async (root, query, options) => {
  Assert.string(root)
  Assert.string(query)
  const results = await TextSearchWorker.invoke('TextSearch.textSearch', root, query, options)
  return results
}

export const cancel = async (searchId) => {
  // TODO
  // await SharedProcess.invoke(
  //   /* Search.cancel */ 'Search.cancel',
  //   /* searchId */ state.searchId
  // )
}
