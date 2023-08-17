import * as Character from '../Character/Character.js'

export const parseMemory = (content) => {
  const trimmedContent = content.trim()
  const numberBlocks = trimmedContent.split(Character.Space)
  const pageSize = 4096
  const rss = Number.parseInt(numberBlocks[1]) * pageSize
  const shared = Number.parseInt(numberBlocks[2]) * pageSize
  const memory = rss - shared
  return memory
}
