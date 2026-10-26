import * as Command from '../Command/Command.js'
import * as FileWatcher from '../FileWatcher/FileWatcher.js'

const watchers = new Map()

const scheduleRefresh = (uid, entry) => {
  clearTimeout(entry.timer)
  entry.timer = setTimeout(() => {
    entry.timer = undefined
    if (watchers.get(uid) !== entry) return
    void Command.execute('Viewlet.executeViewletCommand', uid, 'handleGitIgnoreChange', entry.root).catch(() => {
      // The explorer may have been disposed while the event was queued.
    })
  }, 100)
}

const disposeEntry = async (entry) => {
  if (!entry) return
  clearTimeout(entry.timer)
  if (entry.watcher) {
    entry.watcher.removeEventListener('watcher-event', entry.handleEvent)
    await FileWatcher.dispose(entry.watcher)
  }
}

export const dispose = async (uid) => {
  const entry = watchers.get(uid)
  watchers.delete(uid)
  await disposeEntry(entry)
}

export const watch = async (uid, root, directories) => {
  const roots = [...new Set(directories)].sort()
  const key = JSON.stringify([root, roots])
  if (watchers.get(uid)?.key === key) return
  const previous = watchers.get(uid)
  const handleEvent = (event) => {
    if (watchers.get(uid) !== entry || !['add', 'change', 'unlink'].includes(event.detail.eventName)) return
    scheduleRefresh(uid, entry)
  }
  const entry = { key, root, watcher: undefined, timer: undefined, handleEvent }
  watchers.set(uid, entry)
  await disposeEntry(previous)
  if (watchers.get(uid) !== entry) return
  if (!roots.length || (!root.startsWith('file://') && !root.startsWith('remote-server://'))) {
    watchers.delete(uid)
    return
  }
  try {
    const watcher = await FileWatcher.watch({ childNames: ['.gitignore'], depth: 0, exclude: [], roots, useGitIgnore: false })
    if (watchers.get(uid) !== entry) {
      await FileWatcher.dispose(watcher)
      return
    }
    entry.watcher = watcher
    watcher.addEventListener('watcher-event', entry.handleEvent)
    // Re-read rules once registration is ready to cover changes during setup.
    scheduleRefresh(uid, entry)
  } catch (error) {
    if (watchers.get(uid) === entry) await dispose(uid)
    throw error
  }
}
