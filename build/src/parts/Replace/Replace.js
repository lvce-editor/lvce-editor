import { VError } from '@lvce-editor/verror'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const RE_WHITESPACE = /\s+/g

const snippet = (string) => {
  return string.replaceAll(RE_WHITESPACE, ' ').slice(0, 15)
}

export const replace = async ({ path, occurrence, replacement }) => {
  try {
    const content = await ReadFile.readFile(path)
    if (!content.includes(occurrence)) {
      throw new Error(`occurrence not found ${occurrence}`)
    }
    const newContent = content.replaceAll(occurrence, replacement)
    await WriteFile.writeFile({
      to: path,
      content: newContent,
    })
  } catch (error) {
    const occurrenceSnippet = snippet(occurrence)
    throw new VError(error, `Failed to replace occurrence ${occurrenceSnippet} in ${path}`)
  }
}
