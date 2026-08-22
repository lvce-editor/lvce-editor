import { pathToFileURL } from 'node:url'

const windowsFileUriRegex = /^file:\/\/\/([a-z])(?::|%3a)(?=\/|$)/i

const normalizeRemoteFileUrl = (uri: string): string | undefined => {
  if (!URL.canParse(uri)) {
    return undefined
  }
  const url = new URL(uri)
  if ((url.protocol === 'http:' || url.protocol === 'https:') && url.pathname.startsWith('/remote/')) {
    return `file://${url.pathname.slice('/remote'.length)}`
  }
  return undefined
}

export const normalizeLanguageServerDocumentUri = (uri: string): string => {
  const normalizedUri = uri.startsWith('/') ? pathToFileURL(uri).href : normalizeRemoteFileUrl(uri) || uri
  return normalizedUri.replace(windowsFileUriRegex, (_, driveLetter: string) => `file:///${driveLetter.toLowerCase()}:`)
}
