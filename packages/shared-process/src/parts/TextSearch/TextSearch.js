import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as GetTextSearchRipGrepArgs from '../GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.js'
import * as RipGrep from '../RipGrep/RipGrep.js'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.js'
import { TextSearchError } from '../TextSearchError/TextSearchError.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.js'
import * as WaitForProcessToExit from '../WaitForProcessToExit/WaitForProcessToExit.js'
// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

const collectStdout = async (childProcess, maxSearchResults, charsBefore, charsAfter) => {
  const allSearchResults = Object.create(null)
  let buffer = ''
  let stats = {}
  let limitHit = false
  let numberOfResults = 0

  childProcess.stdout.setEncoding(EncodingType.Utf8)

  const handleLine = (line) => {
    const parsedLine = JSON.parse(line)
    switch (parsedLine.type) {
      case RipGrepParsedLineType.Begin:
        allSearchResults[parsedLine.data.path.text] = [
          {
            type: TextSearchResultType.File,
            start: 0,
            end: 0,
            lineNumber: 0,
            text: parsedLine.data.path.text,
          },
        ]
        break
      case RipGrepParsedLineType.Match:
        const remaining = maxSearchResults - numberOfResults
        const matches = ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)
        numberOfResults += matches.length
        allSearchResults[parsedLine.data.path.text].push(...matches)
        break
      case RipGrepParsedLineType.Summary:
        stats = parsedLine.data
        break
      default:
        break
    }
  }

  const handleData = (chunk) => {
    let newLineIndex = GetNewLineIndex.getNewLineIndex(chunk)
    const dataString = buffer + chunk
    if (newLineIndex === -1) {
      buffer = dataString
      return
    }
    newLineIndex += buffer.length
    let previousIndex = 0
    while (newLineIndex >= 0) {
      const line = dataString.slice(previousIndex, newLineIndex)
      handleLine(line)
      previousIndex = newLineIndex + 1
      newLineIndex = GetNewLineIndex.getNewLineIndex(dataString, previousIndex)
    }
    buffer = dataString.slice(previousIndex)

    if (numberOfResults > maxSearchResults) {
      limitHit = true
      childProcess.kill()
    }
  }

  await pipeline(
    childProcess.stdout,
    new Writable({
      decodeStrings: false,
      construct(callback) {
        callback()
      },
      write(chunk, encoding, callback) {
        try {
          handleData(chunk)
          callback()
        } catch (error) {
          callback(error)
        }
      },
    })
  )
  const results = Object.values(allSearchResults).flat(1)
  return {
    results,
    stats,
    limitHit,
  }
}

export const search = async (searchDir, searchString, { threads = 1, maxSearchResults = 20_000, isCaseSensitive = false } = {}) => {
  const charsBefore = 26
  const charsAfter = 50
  const ripGrepArgs = GetTextSearchRipGrepArgs.getRipGrepArgs({
    threads,
    isCaseSensitive,
    searchString,
  })
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const pipeLinePromise = collectStdout(childProcess, maxSearchResults, charsBefore, charsAfter)
  const closePromise = WaitForProcessToExit.waitForProcessToExit(childProcess)
  const [pipeLineResult, exitResult] = await Promise.all([pipeLinePromise, closePromise])
  if (exitResult.type === ProcessExitEventType.Error) {
    throw new TextSearchError(exitResult.event)
  }
  return pipeLineResult
}
