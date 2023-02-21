import * as Assert from '../Assert/Assert.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

const getProvider = (scheme) => {
  switch (scheme) {
    case '':
      return import('./TextSearchNode.js')
    case 'web':
      return import('./TextSearchWeb.js')
    case 'fetch':
      return import('./TextSearchFetch.js')
    case 'html':
      return import('./TextSearchHtml.js')
    default:
      return import('./TextSearchExtension.js')
  }
}

export const textSearch = async (root, query, options) => {
  Assert.string(root)
  Assert.string(query)
  const scheme = GetProtocol.getProtocol(root)
  const provider = await getProvider(scheme)
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
