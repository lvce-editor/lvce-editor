export const getProvider = (scheme) => {
  switch (scheme) {
    case '':
      return import('../TextSearch/TextSearchNode.ts')
    case 'web':
      return import('../TextSearch/TextSearchWeb.ts')
    case 'fetch':
      return import('../TextSearch/TextSearchFetch.ts')
    case 'html':
      return import('../TextSearch/TextSearchHtml.ts')
    default:
      return import('../TextSearch/TextSearchExtension.ts')
  }
}
