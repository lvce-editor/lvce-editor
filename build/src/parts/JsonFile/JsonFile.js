import VError from 'verror'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

export const readJson = async (path) => {
  try {
    const content = await ReadFile.readFile(path)
    return JSON.parse(content)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to read json file ${path}`)
  }
}

export const writeJson = async ({ to, value }) => {
  const content = JSON.stringify(value, null, 2) + '\n'
  await WriteFile.writeFile({
    to,
    content,
  })
}
