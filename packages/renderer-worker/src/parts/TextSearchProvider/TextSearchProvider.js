export const getProvider = (scheme) => {
  switch (scheme) {
    case '':
      return import('../TextSearch/TextSearchNode.js')
    case 'web':
      return import('../TextSearch/TextSearchWeb.js')
    case 'fetch':
      return import('../TextSearch/TextSearchFetch.js')
    case 'html':
      return import('../TextSearch/TextSearchHtml.js')
    default:
      return import('../TextSearch/TextSearchExtension.js')
  }
}
