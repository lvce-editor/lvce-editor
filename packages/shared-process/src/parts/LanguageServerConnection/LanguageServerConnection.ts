import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LanguageServerMessageParser } from '../LanguageServerMessageParser/LanguageServerMessageParser.ts'
import {
  executeMarkdownLanguageServerRequest,
  isMarkdownLanguageServerRequest,
} from '../MarkdownLanguageServerRequest/MarkdownLanguageServerRequest.ts'

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

const getSpawnOptions = (uri: string, argv: readonly string[]): { readonly args: readonly string[]; readonly command: string } => {
  const executablePath = fileURLToPath(uri)
  const extension = extname(executablePath).toLowerCase()
  if (extension === '.js' || extension === '.mjs' || extension === '.cjs') {
    return {
      args: [executablePath, ...argv],
      command: process.execPath,
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

const getWorkspaceName = (rootUri: string): string => {
  try {
    return basename(fileURLToPath(rootUri)) || 'workspace'
  } catch {
    return 'workspace'
  }
}

export class LanguageServerConnection {
  private readonly child: ChildProcessWithoutNullStreams
  private readonly documents = new Map<string, DocumentState>()
  private readonly parser = new LanguageServerMessageParser()
  private readonly pendingRequests = new Map<number | string, PendingRequest>()
  private readonly ready: Promise<void>
  private readonly rootUri: string
  private markdownConfigured = false
  private nextRequestId = 1
  private running = true
  private stderr = ''

  constructor({ argv, rootUri, uri }: LanguageServerConnectionOptions) {
    this.rootUri = rootUri
    const { args, command } = getSpawnOptions(uri, argv)
    this.child = spawn(command, [...args], {
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

  async complete(textDocument: TextDocument, offset: number): Promise<readonly unknown[]> {
    await this.ready
    this.configureMarkdown(textDocument.languageId)
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

  private configureMarkdown(languageId: string): void {
    if (languageId !== 'markdown' || this.markdownConfigured) {
      return
    }
    this.markdownConfigured = true
    this.sendNotification('workspace/didChangeConfiguration', {
      settings: {
        markdown: {
          occurrencesHighlight: {
            enabled: true,
          },
          preferredMdPathExtensionStyle: 'auto',
          server: {
            log: 'off',
          },
          suggest: {
            paths: {
              enabled: true,
              includeWorkspaceHeaderCompletions: 'never',
            },
          },
          validate: {
            enabled: false,
          },
        },
      },
    })
  }

  private async initialize(): Promise<void> {
    await this.sendRequest('initialize', {
      capabilities: {
        textDocument: {
          completion: {
            completionItem: {
              snippetSupport: true,
            },
          },
          synchronization: {
            didSave: true,
            dynamicRegistration: false,
          },
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
    })
    this.sendNotification('initialized', {})
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
    if (message.method && message.id !== undefined && message.id !== null) {
      void this.handleServerRequest(message)
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

  private async handleServerRequest(message: JsonRpcMessage): Promise<void> {
    try {
      let result: unknown = null
      if (message.method === 'workspace/configuration') {
        const itemCount = Array.isArray(message.params?.items) ? message.params.items.length : 0
        result = Array.from({ length: itemCount }).fill(null)
      } else if (message.method === 'workspace/workspaceFolders') {
        result = [
          {
            name: getWorkspaceName(this.rootUri),
            uri: this.rootUri,
          },
        ]
      } else if (isMarkdownLanguageServerRequest(message.method || '')) {
        result = await executeMarkdownLanguageServerRequest(message.method || '', message.params || {}, {
          documents: this.documents,
          rootUri: this.rootUri,
        })
      }
      this.sendMessage({
        id: message.id,
        jsonrpc: '2.0',
        result,
      })
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

  private sendMessage(message: unknown): void {
    const content = JSON.stringify(message)
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`
    this.child.stdin.write(header + content)
  }
}
