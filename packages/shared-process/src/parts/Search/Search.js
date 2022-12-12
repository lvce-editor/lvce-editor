import { spawn } from 'node:child_process'
import * as Platform from '../Platform/Platform.js'
import * as RgPath from '../RgPath/RgPath.js'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

const MAX_SEARCH_RESULTS = 300

const CHARS_BEFORE = 20
const CHARS_AFTER = 50

const toSearchResult = (parsedLine) => {
  const results = []
  const lines = parsedLine.data.lines.text
  const lineNumber = parsedLine.data.line_number
  for (const submatch of parsedLine.data.submatches) {
    const previewStart = Math.max(submatch.start - CHARS_BEFORE, 0)
    const previewEnd = Math.min(submatch.end + CHARS_AFTER, lines.length)
    const previewText = lines.slice(previewStart, previewEnd)
    results.push({
      type: TextSearchResultType.Match,
      start: submatch.start - previewStart,
      end: submatch.end - previewStart,
      lineNumber,
      text: previewText,
    })
  }
  return results
}

// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO no function call at toplevel!
const useNice = !Platform.isWindows
// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

export const search = async (searchDir, searchString, { threads = 1 } = {}) => {
  // TODO reject promise when ripgrep search fails
  return new Promise((resolve, reject) => {
    const ripGrepArgs = [
      '--smart-case',
      '--stats',
      '--json',
      '--threads',
      `${threads}`,
      '--fixed-strings',
      searchString,
      '.',
    ]
    const childProcess = useNice
      ? spawn('nice', ['-20', RgPath.rgPath, ...ripGrepArgs], {
          cwd: searchDir,
        })
      : spawn(RgPath.rgPath, ripGrepArgs, {
          cwd: searchDir,
        })
    const allSearchResults = Object.create(null)
    let buffer = ''
    let stats = {}
    let limitHit = false
    let numberOfResults = 0
    // TODO use pipeline / transform stream maybe

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
          numberOfResults++
          allSearchResults[parsedLine.data.path.text].push(
            ...toSearchResult(parsedLine)
          )
          break
        case RipGrepParsedLineType.Summary:
          stats = parsedLine.data
          break
        default:
          break
      }
    }

    let total = 0
    const handleData = (chunk) => {
      let newLineIndex = chunk.indexOf('\n')
      const dataString = buffer + chunk
      if (newLineIndex === -1) {
        buffer = dataString
        return
      }
      total += chunk.length
      newLineIndex += buffer.length
      let previousIndex = 0
      while (newLineIndex >= 0) {
        const line = dataString.slice(previousIndex, newLineIndex)
        handleLine(line)
        previousIndex = newLineIndex + 1
        newLineIndex = dataString.indexOf('\n', previousIndex)
      }
      buffer = dataString.slice(previousIndex)

      if (numberOfResults > MAX_SEARCH_RESULTS) {
        limitHit = true
        childProcess.kill()
      }
    }

    const handleClose = () => {
      const results = Object.values(allSearchResults).flat(1)
      resolve({
        results,
        stats,
        limitHit,
      })
    }
    const handleError = (error) => {
      // TODO check type of error
      console.error(error)
      resolve({
        results: [],
        stats,
        limitHit,
      })
    }
    childProcess.stdout.setEncoding('utf8')
    childProcess.stdout.on('data', handleData)
    childProcess.once('close', handleClose)
    childProcess.once('error', handleError)
  })
}
