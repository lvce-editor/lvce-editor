import * as Assert from '../Assert/Assert.js'
import { VError } from '../VError/VError.js'
import * as Vlq from '../Vlq/Vlq.js'

const getColumnMapping = (mappings, line, column) => {
  Assert.string(mappings)
  Assert.number(line)
  Assert.number(column)
  let currentColumn = 0
  let currentLine = 1
  let originalSourceFileIndex = 0
  let originalLine = 0
  let originalColumn = 0
  let index = 0

  while (index !== -1) {
    currentColumn = 0
    const newLineIndex = mappings.indexOf(';', index + 1)
    currentLine++
    if (currentLine === line) {
      const lineMapping = mappings.slice(index + 1, newLineIndex) + ','
      index = -1
      while (true) {
        const newIndex = lineMapping.indexOf(',', index + 1)
        if (newIndex === -1) {
          throw new Error('no mapping found')
        }
        const chunk = lineMapping.slice(index + 1, newIndex)
        const decodedChunk = Vlq.decode(chunk)
        currentColumn += decodedChunk[0]
        originalSourceFileIndex += decodedChunk[1]
        originalLine += decodedChunk[2]
        originalColumn += decodedChunk[3]
        index = newIndex
        if (currentColumn >= column) {
          return {
            originalSourceFileIndex,
            originalLine: originalLine + 1,
            originalColumn,
          }
        }
      }
    } else {
      const lineMappings = mappings.slice(index + 1, newLineIndex)
      if (lineMappings === '') {
        index = newLineIndex
        continue
      }
      const chunks = lineMappings.split(',')
      for (const chunk of chunks) {
        const decodedChunk = Vlq.decode(chunk)
        currentColumn += decodedChunk[0]
        originalSourceFileIndex += decodedChunk[1]
        originalLine += decodedChunk[2]
        originalColumn += decodedChunk[3]
      }
    }
    index = newLineIndex
  }
  throw new Error(`no mapping found`)
}

export const getOriginalPosition = (sourceMap, line, column) => {
  try {
    Assert.object(sourceMap)
    Assert.string(sourceMap.mappings)
    Assert.array(sourceMap.sources)
    Assert.array(sourceMap.names)
    Assert.number(line)
    Assert.number(column)
    const { sources, mappings } = sourceMap
    if (!mappings) {
      throw new Error(`no source for line ${line} found`)
    }
    const { originalLine, originalColumn, originalSourceFileIndex } = getColumnMapping(mappings, line, column)
    const source = sources[originalSourceFileIndex]
    return {
      source,
      originalLine,
      originalColumn,
    }
  } catch (error) {
    throw new VError(error, `Failed to get original sourcemap position`)
  }
}
