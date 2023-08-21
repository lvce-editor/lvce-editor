import { VError } from '@lvce-editor/verror'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

export const readJson = async (path) => {
  try {
    const content = await ReadFile.readFile(path)
    return JSON.parse(content)
  } catch (error) {
    // @ts-ignore
    const wrappedError = new VError(error, `Failed to read json file ${path}`)
    // @ts-ignore
    if (error && error.code) {
      // @ts-ignore
      wrappedError.code = error.code
    }
    throw wrappedError
  }
}

export const writeJson = async ({ to, value }) => {
  const content = JSON.stringify(value, null, 2) + '\n'
  await WriteFile.writeFile({
    to,
    content,
  })
}
