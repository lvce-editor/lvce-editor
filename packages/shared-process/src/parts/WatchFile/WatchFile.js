import { VError } from '@lvce-editor/verror'
import * as fs from 'node:fs/promises'

export const watchFile = async (path, callback) => {
  try {
    const watcher = fs.watch(path)
    for await (const event of watcher) {
      callback(event)
    }
    return watcher
  } catch (error) {
    console.error(new VError(error, `Failed to watch file`))
  }
}
