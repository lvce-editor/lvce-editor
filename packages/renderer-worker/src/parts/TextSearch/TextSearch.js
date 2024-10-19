import * as Assert from '../Assert/Assert.ts'
import * as AssetDir from '../AssetDir/AssetDir.js'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const textSearch = async (root, query, options) => {
  Assert.string(root)
  Assert.string(query)
  const results = await TextSearchWorker.invoke('TextSearch.textSearch', root, query, options, AssetDir.assetDir)
  return results
}

export const cancel = async (searchId) => {
  // TODO
  // await SharedProcess.invoke(
  //   /* Search.cancel */ 'Search.cancel',
  //   /* searchId */ state.searchId
  // )
}
