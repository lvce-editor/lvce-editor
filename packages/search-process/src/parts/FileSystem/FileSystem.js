import * as fs from 'node:fs/promises'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import { VError } from '../VError/VError.js'

/**
 *
 * @param {string} path
 * @param {string} content
 * @param {BufferEncoding} encoding
 */
export const writeFile = async (path, content, encoding = EncodingType.Utf8) => {
  try {
    Assert.string(path)
    Assert.string(content)
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content, encoding)
  } catch (error) {
    throw new VError(error, `Failed to write to file "${path}"`)
  }
}
