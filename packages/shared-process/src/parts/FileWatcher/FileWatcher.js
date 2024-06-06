import * as fs from 'node:fs/promises'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const handleEvents = async (watcher, id, ipc) => {
  try {
    for await (const event of watcher) {
      JsonRpc.send(ipc, 'FileWatcher.handleEvent', id, event)
      // ipc.send('FileWatcher.handleEvent', id, event)
    }
  } catch (error) {
    console.log('event error', error)
  }
}

// TODO  run file watcher in a separate process to not crash application when file watcher crashes
export const watch = async (ipc, id, { roots, exclude }) => {
  try {
    for (const root of roots) {
      const watcher = fs.watch(root, {
        recursive: true,
      })
      handleEvents(watcher, id, ipc)
    }
  } catch (error) {
    console.error(error)
  }
}
