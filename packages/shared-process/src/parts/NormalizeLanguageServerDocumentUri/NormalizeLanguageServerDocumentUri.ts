import { pathToFileURL } from 'node:url'

const windowsFileUriRegex = /^file:\/\/\/([a-z])(?::|%3a)(?=\/|$)/i

export const normalizeLanguageServerDocumentUri = (uri: string): string => {
  if (uri.startsWith('/')) {
    return pathToFileURL(uri).href
  }
  return uri.replace(windowsFileUriRegex, (_, driveLetter: string) => `file:///${driveLetter.toLowerCase()}%3A`)
}
