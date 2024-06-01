import * as fs from 'node:fs/promises'

const handleEvents = async (watcher, id, ipc) => {
  try {
    for await (const event of watcher) {
      console.log(event)
      ipc.send('FileWatcher.handleEvent')
    }
  } catch (error) {
    console.log('event error', error)
  }
}

// TODO  run file watcher in a separate process to not crash application when file watcher crashes
export const watch = async (ipc, id, { root, exclude }) => {
  try {
    console.log('start watching', root)
    const watcher = fs.watch(root, {
      recursive: true,
    })
    handleEvents(watcher, id, ipc)
  } catch (error) {
    console.error(error)
  }
  console.log('finish watching')
}
