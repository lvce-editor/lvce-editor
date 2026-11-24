import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import { LanguageServerConnection } from '../LanguageServerConnection/LanguageServerConnection.ts'
import { normalizeLanguageServerDocumentUri } from '../NormalizeLanguageServerDocumentUri/NormalizeLanguageServerDocumentUri.ts'

interface TextDocument {
  readonly languageId: string
  readonly text: string
  readonly uri: string
}

export interface CompleteOptions {
  readonly argv: readonly string[]
  readonly extensionId: string
  readonly id: string
  readonly offset: number
  readonly rootUri?: string
  readonly textDocument: TextDocument
  readonly uri: string
}

export type CodeActionOptions = CompleteOptions & { readonly only?: string }

export interface DiagnosticOptions {
  readonly argv: readonly string[]
  readonly extensionId: string
  readonly id: string
  readonly rootUri?: string
  readonly textDocument: TextDocument
  readonly uri: string
}

export type DefinitionOptions = CompleteOptions

export type DocumentSymbolOptions = DiagnosticOptions

export type ReferencesOptions = CompleteOptions

export interface FormatOptions {
  readonly argv: readonly string[]
  readonly extensionId: string
  readonly id: string
  readonly rootUri?: string
  readonly textDocument: TextDocument
  readonly uri: string
}

interface ConnectionState {
  readonly argv: readonly string[]
  readonly connection: LanguageServerConnection
  readonly extensionId: string
  readonly uri: string
}

const connections = new Map<string, ConnectionState>()
const diagnosticObservers = new Set<any>()

export const observeDiagnostics = (ipc: any): void => {
  if (diagnosticObservers.has(ipc)) {
    return
  }
  diagnosticObservers.add(ipc)
  const onClose = (): void => {
    diagnosticObservers.delete(ipc)
    if (ipc.removeEventListener) {
      ipc.removeEventListener('close', onClose)
    } else {
      ipc.off('close', onClose)
    }
  }
  if (ipc.addEventListener) {
    ipc.addEventListener('close', onClose)
  } else {
    ipc.on('close', onClose)
  }
}

const refreshDiagnostics = (rootUri: string): void => {
  for (const ipc of diagnosticObservers) {
    JsonRpc.send(ipc, 'GetActiveEditor.refreshLanguageServerDiagnostics', rootUri)
  }
}

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

const getConnection = (id: string, extensionId: string, uri: string, argv: readonly string[], workspace: string): LanguageServerConnection => {
  const rootUri = normalizeLanguageServerDocumentUri(workspace)
  const key = `${id}:${rootUri}`
  const existing = connections.get(key)
  if (existing && existing.extensionId === extensionId && existing.connection.isRunning() && hasSameOptions(existing, uri, argv)) {
    return existing.connection
  }
  existing?.connection.dispose()
  const connection = new LanguageServerConnection({ argv, refreshDiagnostics: (): void => refreshDiagnostics(workspace), rootUri, uri })
  connections.set(key, {
    argv: [...argv],
    connection,
    extensionId,
    uri,
  })
  return connection
}

export const complete = async ({ argv, extensionId, id, offset, rootUri, textDocument, uri }: CompleteOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.complete(normalizedDocument, offset)
}

export const codeAction = async ({
  argv,
  extensionId,
  id,
  offset,
  only,
  rootUri,
  textDocument,
  uri,
}: CodeActionOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.codeAction(normalizedDocument, offset, only)
}

export const diagnostic = async ({ argv, extensionId, id, rootUri, textDocument, uri }: DiagnosticOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.diagnostic(normalizedDocument)
}

export const definition = async ({ argv, extensionId, id, offset, rootUri, textDocument, uri }: DefinitionOptions): Promise<unknown> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.definition(normalizedDocument, offset)
}

export const documentSymbols = async ({ argv, extensionId, id, rootUri, textDocument, uri }: DocumentSymbolOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.documentSymbols(normalizedDocument)
}

export const format = async ({ argv, extensionId, id, rootUri, textDocument, uri }: FormatOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.format(normalizedDocument)
}

export const references = async ({ argv, extensionId, id, offset, rootUri, textDocument, uri }: ReferencesOptions): Promise<readonly unknown[]> => {
  const normalizedDocument = {
    ...textDocument,
    uri: normalizeLanguageServerDocumentUri(textDocument.uri),
  }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.references(normalizedDocument, offset)
}

export const feature = async ({
  argv,
  extensionId,
  id,
  method,
  newName,
  offset,
  rootUri,
  textDocument,
  uri,
}: CompleteOptions & {
  readonly method: string
  readonly newName?: string
}): Promise<unknown> => {
  const normalizedDocument = { ...textDocument, uri: normalizeLanguageServerDocumentUri(textDocument.uri) }
  const connection = getConnection(id, extensionId, uri, argv, rootUri || getRootUri(normalizedDocument.uri))
  return connection.feature(normalizedDocument, method, offset, newName)
}

export const dispose = (extensionId: string): void => {
  for (const [id, state] of connections) {
    if (state.extensionId === extensionId) {
      state.connection.dispose()
      connections.delete(id)
    }
  }
}

export const disposeAll = (): void => {
  for (const state of connections.values()) {
    state.connection.dispose()
  }
  connections.clear()
}
