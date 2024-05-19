import * as SearchWorker from '../SearchWorker/SearchWorker.js'

export const textSearch = async (root, query, options) => {
  return SearchWorker.invoke('TextSearch.textSearch', root, query, options)
}

export const cancel = async (searchId) => {
  // TODO
  // await SharedProcess.invoke(
  //   /* Search.cancel */ 'Search.cancel',
  //   /* searchId */ state.searchId
  // )
}
