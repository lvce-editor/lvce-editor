import { basename, isAbsolute, matchesGlob, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

interface Watcher {
  readonly globPattern: string | { readonly baseUri: string | { readonly uri: string }; readonly pattern: string }
  readonly kind?: number
}

interface FileChange {
  readonly type: number
  readonly uri: string
}

interface Pattern {
  readonly glob: string
  readonly kind: number
}

const eventTypes = { add: [1, 1], change: [2, 2], unlink: [4, 3] } as const

const toGlobPath = (path: string): string => (process.platform === 'win32' ? path.replaceAll('\\', '/').toLowerCase() : path)

const parseWatcher = (workspace: string, { globPattern, kind = 7 }: Watcher): Pattern => {
  const glob =
    typeof globPattern === 'string'
      ? globPattern
      : resolve(fileURLToPath(typeof globPattern.baseUri === 'string' ? globPattern.baseUri : globPattern.baseUri.uri), globPattern.pattern)
  return { glob: toGlobPath(isAbsolute(glob) ? glob : resolve(workspace, glob)), kind }
}

export class LanguageServerFileWatcher {
  private readonly patterns = new Map<string, readonly Pattern[]>()
  private readonly workspace: string
  private readonly sendChanges: (changes: readonly FileChange[]) => void
  private subscription: { readonly controller: AbortController; readonly ready: Promise<void> } | undefined
  private readonly changes: FileChange[] = []
  private flushTimer: ReturnType<typeof setTimeout> | undefined

  constructor(workspacePath: string, sendChanges: (changes: readonly FileChange[]) => void) {
    this.workspace = workspacePath
    this.sendChanges = sendChanges
  }

  async register(id: string, watchers: readonly Watcher[]): Promise<void> {
    const patterns = watchers.map((watcher) => parseWatcher(this.workspace, watcher))
    this.patterns.set(id, patterns)
    // Keep one workspace watch per connection. Language servers can request
    // broad patterns outside the project (for example, in its parent directory).
    if (!this.subscription) {
      const controller = new AbortController()
      this.subscription = { controller, ready: this.subscribe(controller.signal) }
    }
    const subscription = this.subscription
    try {
      await subscription.ready
    } catch (error) {
      if (this.subscription === subscription) {
        this.subscription = undefined
      }
      if (this.patterns.get(id) === patterns) {
        this.unregister(id)
      }
      throw error
    }
  }

  unregister(id: string): void {
    this.patterns.delete(id)
    if (this.patterns.size === 0) {
      this.dispose()
    }
  }

  dispose(): void {
    this.patterns.clear()
    const subscription = this.subscription
    this.subscription = undefined
    clearTimeout(this.flushTimer)
    this.flushTimer = undefined
    this.changes.length = 0
    subscription?.controller.abort()
  }

  private async subscribe(signal: AbortSignal): Promise<void> {
    const { watch } = await import('chokidar')
    signal.throwIfAborted()
    const watcher = watch(this.workspace, {
      followSymlinks: false,
      ignored: (path) => path !== this.workspace && basename(path) === '.git',
      ignoreInitial: true,
    })
    // TypeScript consumes file notifications. A directory creation can arrive
    // before its installed declarations are visible to TypeScript.
    watcher.on('all', (event, path) => {
      if (!signal.aborted && (event === 'add' || event === 'change' || event === 'unlink')) {
        this.handleEvent(event, path)
      }
    })
    await new Promise<void>((resolve, reject) => {
      let ready = false
      const close = (): void => {
        void watcher.close().catch((error) => console.warn(`[language-server] File watcher shutdown failed: ${String(error)}`))
      }
      signal.addEventListener('abort', () => {
        close()
        reject(signal.reason)
      }, { once: true })
      watcher.once('ready', () => {
        ready = true
        resolve()
      })
      watcher.on('error', (error) => {
        if (ready) {
          console.warn(`[language-server] File watcher for ${this.workspace} failed: ${String(error)}`)
        } else {
          close()
          reject(error)
        }
      })
    })
  }

  private handleEvent(event: keyof typeof eventTypes, file: string): void {
    const [kind, type] = eventTypes[event]
    const path = toGlobPath(file)
    const matches = [...this.patterns.values()].some((patterns) =>
      patterns.some((pattern) => (pattern.kind & kind) !== 0 && matchesGlob(path, pattern.glob)),
    )
    if (!matches) {
      return
    }
    const uri = pathToFileURL(file).href
    this.changes.push({ type, uri })
    this.flushTimer ??= setTimeout(() => {
      this.flushTimer = undefined
      const changes = this.changes.splice(0)
      this.sendChanges(changes)
    }, 50)
  }
}
