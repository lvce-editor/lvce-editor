import * as fs from 'node:fs/promises'

const handleEvents = async (watcher) => {
  try {
    console.log(watcher)
    for await (const event of watcher) {
      console.log(event)
    }
  } catch (error) {
    console.log('event error', error)
  }
}

// TODO  run file watcher in a separate process to not crash application when file watcher crashes
export const watch = async ({ root, exclude }) => {
  try {
    console.log('start watching', root)
    const watcher = fs.watch(root, {
      recursive: true,
    })
    handleEvents(watcher)
  } catch (error) {
    console.error(error)
  }
  console.log('finish watching')
}
