import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LanguageServerMessageParser } from '../LanguageServerMessageParser/LanguageServerMessageParser.ts'
import { normalizeLanguageServerDocumentUri } from '../NormalizeLanguageServerDocumentUri/NormalizeLanguageServerDocumentUri.ts'

interface JsonRpcMessage {
  readonly error?: {
    readonly code?: number
    readonly message?: string
  }
  readonly id?: number | string | null
  readonly method?: string
  readonly params?: any
  readonly result?: unknown
}

interface PendingRequest {
  readonly reject: (error: Error) => void
  readonly resolve: (value: unknown) => void
}

interface PendingDiagnostics {
  readonly reject: (error: Error) => void
  readonly resolve: (value: readonly unknown[]) => void
}

interface InitializeResult {
  readonly capabilities?: {
    readonly codeActionProvider?: unknown
    readonly diagnosticProvider?: unknown
    readonly documentFormattingProvider?: unknown
    readonly documentSymbolProvider?: unknown
    readonly referencesProvider?: unknown
  }
}

interface Deferred {
  readonly promise: Promise<void>
  readonly resolve: () => void
}

interface TextDocument {
  readonly languageId: string
  readonly text: string
  readonly uri: string
}

interface DocumentState {
  readonly languageId: string
  readonly text: string
  readonly version: number
}

export interface LanguageServerConnectionOptions {
  readonly argv: readonly string[]
  readonly rootUri: string
  readonly uri: string
}

export const getSpawnOptions = (
  uri: string,
  argv: readonly string[],
): { readonly args: readonly string[]; readonly command: string; readonly env?: NodeJS.ProcessEnv } => {
  const executablePath = fileURLToPath(uri)
  const extension = extname(executablePath).toLowerCase()
  if (extension === '.js' || extension === '.mjs' || extension === '.cjs') {
    return {
      args: [executablePath, ...argv],
      command: process.execPath,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
      },
    }
  }
  return {
    args: argv,
    command: executablePath,
  }
}

const getPosition = (text: string, offset: number): { readonly character: number; readonly line: number } => {
  const safeOffset = Math.max(0, Math.min(offset, text.length))
  const before = text.slice(0, safeOffset)
  const lastLineBreak = before.lastIndexOf('\n')
  return {
    character: lastLineBreak === -1 ? safeOffset : safeOffset - lastLineBreak - 1,
    line: before.split('\n').length - 1,
  }
}

interface Position {
  readonly character: number
  readonly line: number
}

interface Range {
  readonly end: Position
  readonly start: Position
}

const comparePositions = (first: Position, second: Position): number => {
  return first.line - second.line || first.character - second.character
}

const isPosition = (value: unknown): value is Position => {
  return (
    Boolean(value) && typeof value === 'object' && typeof (value as Position).character === 'number' && typeof (value as Position).line === 'number'
  )
}

const containsPosition = (value: unknown, position: Position): boolean => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const range = (value as { readonly range?: Range }).range
  return Boolean(
    range &&
    isPosition(range.start) &&
    isPosition(range.end) &&
    comparePositions(range.start, position) <= 0 &&
    comparePositions(position, range.end) <= 0,
  )
}

const getWorkspaceName = (rootUri: string): string => {
  try {
    return basename(fileURLToPath(rootUri)) || 'workspace'
  } catch {
    return 'workspace'
  }
}

const createDeferred = (): Deferred => {
  let resolve = (): void => {}
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

const wait = (duration: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

const PublishDiagnosticsTimeout = 1_000

export class LanguageServerConnection {
  private readonly child: ChildProcessWithoutNullStreams
  private readonly configurationHandled = createDeferred()
  private readonly diagnosticWaiters = new Map<string, Set<PendingDiagnostics>>()
  private readonly documents = new Map<string, DocumentState>()
  private readonly initializationProgressEnded = createDeferred()
  private readonly initializationProgressStarted = createDeferred()
  private readonly parser = new LanguageServerMessageParser()
  private readonly pendingRequests = new Map<number | string, PendingRequest>()
  private readonly publishedDiagnostics = new Map<string, readonly unknown[]>()
  private readonly ready: Promise<void>
  private readonly rootUri: string
  private initializationProgressWasStarted = false
  private nextRequestId = 1
  private running = true
  private stderr = ''
  private supportsCodeActions = false
  private supportsDocumentFormatting = false
  private supportsDocumentSymbols = false
  private supportsPullDiagnostics = false
  private supportsReferences = false

  constructor({ argv, rootUri, uri }: LanguageServerConnectionOptions) {
    this.rootUri = rootUri
    const { args, command, env } = getSpawnOptions(uri, argv)
    this.child = spawn(command, [...args], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.child.stdout.on('data', (chunk: Buffer) => {
      this.handleData(chunk)
    })
    this.child.stderr.on('data', (chunk: Buffer) => {
      this.stderr += chunk.toString()
    })
    this.child.on('error', (error) => {
      this.handleExit(error)
    })
    this.child.on('exit', (code, signal) => {
      const detail = this.stderr.trim()
      const suffix = detail ? `: ${detail}` : ''
      this.handleExit(new Error(`Language server exited with code ${code} and signal ${signal}${suffix}`))
    })
    this.ready = this.initialize()
  }

  isRunning(): boolean {
    return this.running
  }

  dispose(): void {
    if (!this.running) {
      return
    }
    this.running = false
    this.child.kill()
    this.rejectPendingRequests(new Error('Language server was disposed'))
  }

  async codeAction(textDocument: TextDocument, offset: number): Promise<readonly unknown[]> {
    await this.ready
    if (!this.supportsCodeActions) {
      return []
    }
    const diagnostics = await this.diagnostic(textDocument)
    const position = getPosition(textDocument.text, offset)
    const result = await this.sendRequest('textDocument/codeAction', {
      context: {
        diagnostics: diagnostics.filter((diagnostic) => containsPosition(diagnostic, position)),
      },
      range: {
        end: position,
        start: position,
      },
      textDocument: {
        uri: textDocument.uri,
      },
    })
    return Array.isArray(result) ? result : []
  }

  async complete(textDocument: TextDocument, offset: number): Promise<readonly unknown[]> {
    await this.ready
    this.syncDocument(textDocument)
    const result = await this.sendRequest('textDocument/completion', {
      context: {
        triggerKind: 1,
      },
      position: getPosition(textDocument.text, offset),
      textDocument: {
        uri: textDocument.uri,
      },
    })
    if (Array.isArray(result)) {
      return result
    }
    if (result && typeof result === 'object' && Array.isArray((result as { readonly items?: unknown }).items)) {
      return (result as { readonly items: readonly unknown[] }).items
    }
    return []
  }

  async diagnostic(textDocument: TextDocument): Promise<readonly unknown[]> {
    await this.ready
    if (this.supportsPullDiagnostics) {
      this.syncDocument(textDocument)
      const result = await this.sendRequest('textDocument/diagnostic', {
        textDocument: {
          uri: textDocument.uri,
        },
      })
      if (result && typeof result === 'object' && Array.isArray((result as { readonly items?: unknown }).items)) {
        return (result as { readonly items: readonly unknown[] }).items
      }
      return []
    }
    const previous = this.documents.get(textDocument.uri)
    const documentChanged = !previous || previous.languageId !== textDocument.languageId || previous.text !== textDocument.text
    const cached = this.publishedDiagnostics.get(textDocument.uri)
    if (!documentChanged && cached) {
      return cached
    }
    const diagnostics = this.waitForPublishedDiagnostics(textDocument.uri)
    if (documentChanged) {
      this.syncDocument(textDocument)
    }
    return diagnostics
  }

  async definition(textDocument: TextDocument, offset: number): Promise<unknown> {
    await this.ready
    this.syncDocument(textDocument)
    return this.sendRequest('textDocument/definition', {
      position: getPosition(textDocument.text, offset),
      textDocument: {
        uri: textDocument.uri,
      },
    })
  }

  async documentSymbols(textDocument: TextDocument): Promise<readonly unknown[]> {
    await this.ready
    if (!this.supportsDocumentSymbols) {
      return []
    }
    this.syncDocument(textDocument)
    const result = await this.sendRequest('textDocument/documentSymbol', {
      textDocument: {
        uri: textDocument.uri,
      },
    })
    return Array.isArray(result) ? result : []
  }

  async format(textDocument: TextDocument): Promise<readonly unknown[]> {
    await this.ready
    if (!this.supportsDocumentFormatting) {
      return []
    }
    this.syncDocument(textDocument)
    const result = await this.sendRequest('textDocument/formatting', {
      options: {
        insertSpaces: true,
        tabSize: 2,
      },
      textDocument: {
        uri: textDocument.uri,
      },
    })
    return Array.isArray(result) ? result : []
  }

  async references(textDocument: TextDocument, offset: number): Promise<readonly unknown[]> {
    await this.ready
    if (!this.supportsReferences) {
      return []
    }
    this.syncDocument(textDocument)
    const result = await this.sendRequest('textDocument/references', {
      context: {
        includeDeclaration: true,
      },
      position: getPosition(textDocument.text, offset),
      textDocument: {
        uri: textDocument.uri,
      },
    })
    return Array.isArray(result) ? result : []
  }

  private async initialize(): Promise<void> {
    const result = (await this.sendRequest('initialize', {
      capabilities: {
        textDocument: {
          codeAction: {
            codeActionLiteralSupport: {
              codeActionKind: {
                valueSet: ['', 'quickfix', 'refactor', 'refactor.extract', 'refactor.inline', 'refactor.rewrite', 'source', 'source.organizeImports'],
              },
            },
          },
          completion: {
            completionItem: {
              snippetSupport: true,
            },
          },
          diagnostic: {
            dynamicRegistration: false,
            relatedDocumentSupport: false,
          },
          documentSymbol: {
            dynamicRegistration: false,
            hierarchicalDocumentSymbolSupport: true,
          },
          publishDiagnostics: {
            relatedInformation: true,
          },
          references: {
            dynamicRegistration: false,
          },
          synchronization: {
            didSave: true,
            dynamicRegistration: false,
          },
        },
        window: {
          workDoneProgress: true,
        },
        workspace: {
          configuration: true,
          workspaceFolders: true,
        },
      },
      clientInfo: {
        name: 'Lvce Editor',
      },
      processId: process.pid,
      rootUri: this.rootUri,
      workspaceFolders: [
        {
          name: getWorkspaceName(this.rootUri),
          uri: this.rootUri,
        },
      ],
    })) as InitializeResult
    this.supportsCodeActions = Boolean(result?.capabilities?.codeActionProvider)
    this.supportsDocumentFormatting = Boolean(result?.capabilities?.documentFormattingProvider)
    this.supportsDocumentSymbols = Boolean(result?.capabilities?.documentSymbolProvider)
    this.supportsPullDiagnostics = Boolean(result?.capabilities?.diagnosticProvider)
    this.supportsReferences = Boolean(result?.capabilities?.referencesProvider)
    this.sendNotification('initialized', {})
    await Promise.race([this.initializationProgressStarted.promise, wait(100)])
    if (this.initializationProgressWasStarted) {
      await Promise.race([this.initializationProgressEnded.promise, wait(30_000)])
    }
    await Promise.race([this.configurationHandled.promise, wait(100)])
    await wait(0)
  }

  private syncDocument(textDocument: TextDocument): void {
    const previous = this.documents.get(textDocument.uri)
    if (!previous || previous.languageId !== textDocument.languageId) {
      if (previous) {
        this.sendNotification('textDocument/didClose', {
          textDocument: {
            uri: textDocument.uri,
          },
        })
      }
      const next = {
        languageId: textDocument.languageId,
        text: textDocument.text,
        version: 1,
      }
      this.documents.set(textDocument.uri, next)
      this.sendNotification('textDocument/didOpen', {
        textDocument: {
          languageId: next.languageId,
          text: next.text,
          uri: textDocument.uri,
          version: next.version,
        },
      })
      return
    }
    if (previous.text === textDocument.text) {
      return
    }
    const next = {
      ...previous,
      text: textDocument.text,
      version: previous.version + 1,
    }
    this.documents.set(textDocument.uri, next)
    this.sendNotification('textDocument/didChange', {
      contentChanges: [
        {
          text: next.text,
        },
      ],
      textDocument: {
        uri: textDocument.uri,
        version: next.version,
      },
    })
  }

  private handleData(chunk: Buffer): void {
    try {
      const messages = this.parser.push(chunk)
      for (const message of messages) {
        this.handleMessage(message as JsonRpcMessage)
      }
    } catch (error) {
      this.handleExit(error instanceof Error ? error : new Error(String(error)))
    }
  }

  private handleMessage(message: JsonRpcMessage): void {
    if (message.method === 'textDocument/publishDiagnostics') {
      this.handlePublishedDiagnostics(message.params)
      return
    }
    if (message.method === '$/progress') {
      this.handleProgress(message.params)
      return
    }
    if (message.method && message.id !== undefined && message.id !== null) {
      this.handleServerRequest(message)
      return
    }
    if (message.id === undefined || message.id === null) {
      return
    }
    const pending = this.pendingRequests.get(message.id)
    if (!pending) {
      return
    }
    this.pendingRequests.delete(message.id)
    if (message.error) {
      pending.reject(new Error(message.error.message || `Language server request failed with code ${message.error.code}`))
      return
    }
    pending.resolve(message.result)
  }

  private handlePublishedDiagnostics(params: unknown): void {
    if (!params || typeof params !== 'object') {
      return
    }
    const { diagnostics, uri } = params as { readonly diagnostics?: unknown; readonly uri?: unknown }
    if (typeof uri !== 'string' || !Array.isArray(diagnostics)) {
      return
    }
    const normalizedUri = normalizeLanguageServerDocumentUri(uri)
    this.publishedDiagnostics.set(normalizedUri, diagnostics)
    const waiters = this.diagnosticWaiters.get(normalizedUri)
    if (!waiters) {
      return
    }
    this.diagnosticWaiters.delete(normalizedUri)
    for (const waiter of waiters) {
      waiter.resolve(diagnostics)
    }
  }

  private handleProgress(params: unknown): void {
    if (!params || typeof params !== 'object') {
      return
    }
    const { value } = params as { readonly value?: unknown }
    if (!value || typeof value !== 'object' || (value as { readonly kind?: unknown }).kind !== 'end') {
      return
    }
    this.initializationProgressEnded.resolve()
  }

  private handleServerRequest(message: JsonRpcMessage): void {
    try {
      let result: unknown = null
      if (message.method === 'workspace/configuration') {
        const itemCount = Array.isArray(message.params?.items) ? message.params.items.length : 0
        result = Array.from({ length: itemCount }).fill(null)
      } else if (message.method === 'window/workDoneProgress/create') {
        this.initializationProgressWasStarted = true
        this.initializationProgressStarted.resolve()
      } else if (message.method === 'workspace/workspaceFolders') {
        result = [
          {
            name: getWorkspaceName(this.rootUri),
            uri: this.rootUri,
          },
        ]
      }
      this.sendMessage({
        id: message.id,
        jsonrpc: '2.0',
        result,
      })
      if (message.method === 'workspace/configuration') {
        this.configurationHandled.resolve()
      }
    } catch (error) {
      this.sendMessage({
        error: {
          code: -32_603,
          message: error instanceof Error ? error.message : String(error),
        },
        id: message.id,
        jsonrpc: '2.0',
      })
    }
  }

  private handleExit(error: Error): void {
    if (!this.running) {
      return
    }
    this.running = false
    this.rejectPendingRequests(error)
  }

  private rejectPendingRequests(error: Error): void {
    for (const pending of this.pendingRequests.values()) {
      pending.reject(error)
    }
    this.pendingRequests.clear()
    for (const waiters of this.diagnosticWaiters.values()) {
      for (const waiter of waiters) {
        waiter.reject(error)
      }
    }
    this.diagnosticWaiters.clear()
  }

  private sendNotification(method: string, params: unknown): void {
    this.sendMessage({
      jsonrpc: '2.0',
      method,
      params,
    })
  }

  private sendRequest(method: string, params: unknown): Promise<unknown> {
    if (!this.running) {
      return Promise.reject(new Error('Language server is not running'))
    }
    const id = this.nextRequestId++
    const promise = new Promise<unknown>((resolve, reject) => {
      this.pendingRequests.set(id, { reject, resolve })
    })
    this.sendMessage({
      id,
      jsonrpc: '2.0',
      method,
      params,
    })
    return promise
  }

  private waitForPublishedDiagnostics(uri: string): Promise<readonly unknown[]> {
    return new Promise<readonly unknown[]>((resolve, reject) => {
      const waiters = this.diagnosticWaiters.get(uri) || new Set()
      let timeout: ReturnType<typeof setTimeout>
      const waiter = {
        reject(error: Error): void {
          clearTimeout(timeout)
          reject(error)
        },
        resolve(value: readonly unknown[]): void {
          clearTimeout(timeout)
          resolve(value)
        },
      }
      timeout = setTimeout(() => {
        waiters.delete(waiter)
        if (waiters.size === 0) {
          this.diagnosticWaiters.delete(uri)
        }
        resolve(this.publishedDiagnostics.get(uri) || [])
      }, PublishDiagnosticsTimeout)
      waiters.add(waiter)
      this.diagnosticWaiters.set(uri, waiters)
    })
  }

  private sendMessage(message: unknown): void {
    const content = JSON.stringify(message)
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`
    this.child.stdin.write(header + content)
  }
}
