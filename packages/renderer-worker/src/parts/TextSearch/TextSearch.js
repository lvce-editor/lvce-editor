import * as Assert from '../Assert/Assert.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

const getProvider = (scheme) => {
  switch (scheme) {
    case '':
      return import('./TextSearchNode.js')
    case 'web':
      return import('./TextSearchWeb.js')
    default:
      return import('./TextSearchExtension.js')
  }
}

export const textSearch = async (root, query) => {
  Assert.string(root)
  Assert.string(query)
  const scheme = FileSystem.getProtocol(root)
  const provider = await getProvider(scheme)
  const results = await provider.textSearch(scheme, root, query)
  return results
}

export const cancel = async (searchId) => {
  // TODO
  // await SharedProcess.invoke(
  //   /* Search.cancel */ 'Search.cancel',
  //   /* searchId */ state.searchId
  // )
}
