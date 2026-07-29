import { pathToFileURL } from 'node:url'

const windowsFileUriRegex = /^file:\/\/\/([a-z])(?::|%3a)(?=\/|$)/i

const normalizeRemoteFileUrl = (uri: string): string | undefined => {
  try {
    const url = new URL(uri)
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.pathname.startsWith('/remote/')) {
      return pathToFileURL(decodeURIComponent(url.pathname.slice('/remote'.length))).href
    }
  } catch {
    return undefined
  }
  return undefined
}

export const normalizeLanguageServerDocumentUri = (uri: string): string => {
  if (uri.startsWith('/')) {
    return pathToFileURL(uri).href
  }
  const normalizedUri = normalizeRemoteFileUrl(uri) || uri
  return normalizedUri.replace(windowsFileUriRegex, (_, driveLetter: string) => `file:///${driveLetter.toLowerCase()}%3A`)
}
