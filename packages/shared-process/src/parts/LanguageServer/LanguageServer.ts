import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { LanguageServerConnection } from '../LanguageServerConnection/LanguageServerConnection.ts'
import { normalizeLanguageServerDocumentUri } from '../NormalizeLanguageServerDocumentUri/NormalizeLanguageServerDocumentUri.ts'

interface TextDocument {
  readonly languageId: string
  readonly text: string
  readonly uri: string
}

export interface CompleteOptions {
  readonly argv: readonly string[]
  readonly id: string
  readonly offset: number
  readonly textDocument: TextDocument
  readonly uri: string
}

export interface DiagnosticOptions {
  readonly argv: readonly string[]
  readonly id: string
  readonly textDocument: TextDocument
  readonly uri: string
}

interface ConnectionState {
  readonly argv: readonly string[]
  readonly connection: LanguageServerConnection
  readonly uri: string
}

const connections = new Map<string, ConnectionState>()

const getRootUri = (documentUri: string): string => {
  if (documentUri.startsWith('file:')) {
    return new URL('.', documentUri).href
  }
  if (documentUri.startsWith('/')) {
    return pathToFileURL(dirname(documentUri)).href
  }
  return new URL('.', documentUri).href
}

const hasSameOptions = (state: ConnectionState, uri: string, argv: readonly string[]): boolean => {
  return state.uri === uri && state.argv.length === argv.length && state.argv.every((argument, index) => argument === argv[index])
}

const getConnection = (id: string, uri: string, argv: readonly string[], rootUri: string): LanguageServerConnection => {
  const existing = connections.get(id)
  if (existing && existing.connection.isRunning() && hasSameOptions(existing, uri, argv)) {
    return existing.connection
  }
  existing?.connection.dispose()
  const connection = new LanguageServerConnection({ argv, rootUri, uri })
  connections.set(id, {
    argv: [...argv],
    connection,
    uri,
  })
  return connection
}

export const complete = async ({ argv, id, offset, textDocument, uri }: CompleteOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const rootUri = getRootUri(normalizedDocument.uri)
  const connection = getConnection(`${id}:${rootUri}`, uri, argv, rootUri)
  return connection.complete(normalizedDocument, offset)
}

export const diagnostic = async ({ argv, id, textDocument, uri }: DiagnosticOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const rootUri = getRootUri(normalizedDocument.uri)
  const connection = getConnection(`${id}:${rootUri}`, uri, argv, rootUri)
  return connection.diagnostic(normalizedDocument)
}

export const disposeAll = (): void => {
  for (const state of connections.values()) {
    state.connection.dispose()
  }
  connections.clear()
}
