import { LanguageServerConnection } from '../packages/shared-process/src/parts/LanguageServerConnection/LanguageServerConnection.ts'
import { LanguageServerFileWatcher } from '../packages/shared-process/src/parts/LanguageServerFileWatcher/LanguageServerFileWatcher.ts'

const events = []
const record = (event) => events.push([performance.now(), event])
for (const method of ['handleMessage', 'sendMessage']) {
  const original = LanguageServerConnection.prototype[method]
  LanguageServerConnection.prototype[method] = function (message) {
    if (
      ['client/registerCapability', 'workspace/didChangeWatchedFiles', 'workspace/diagnostic/refresh', 'textDocument/diagnostic'].includes(message.method) ||
      message.error ||
      message.result?.items ||
      (message.method === 'window/logMessage' && /watch|diagnostic|file changes/i.test(message.params?.message))
    ) {
      record({ method, message })
    }
    return original.call(this, message)
  }
}
const subscribe = LanguageServerFileWatcher.prototype.subscribe
LanguageServerFileWatcher.prototype.subscribe = async function (signal) {
  record({ watchStarting: this.workspace })
  try {
    await subscribe.call(this, signal)
    record({ watchReady: this.workspace })
  } catch (error) {
    record({ watchFailed: String(error) })
    throw error
  }
}
const handleEvent = LanguageServerFileWatcher.prototype.handleEvent
LanguageServerFileWatcher.prototype.handleEvent = function (event, path) {
  record({ event, path, patterns: [...this.patterns] })
  return handleEvent.call(this, event, path)
}
process.on('exit', () => {
  for (const event of events) console.error(JSON.stringify(event))
})
