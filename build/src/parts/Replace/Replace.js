import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

export const replace = async ({ path, occurrence, replacement }) => {
  const content = await ReadFile.readFile(path)
  const newContent = content.replaceAll(occurrence, replacement)
  await WriteFile.writeFile({
    to: path,
    content: newContent,
  })
}
