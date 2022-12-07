import { spawn } from 'node:child_process'
import * as Platform from '../Platform/Platform.js'
import * as RgPath from '../RgPath/RgPath.js'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const MAX_SEARCH_RESULTS = 300

const toSearchResult = (parsedLine) => {
  return {
    preview: parsedLine.data.lines.text,
    absoluteOffset: parsedLine.data.absolute_offset,
    lineNumber: parsedLine.data.line_number - 1,
  }
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

export const search = async (searchDir, searchString) => {
  // TODO reject promise when ripgrep search fails
  return new Promise((resolve, reject) => {
    const ripGrepArgs = [
      '--smart-case',
      '--stats',
      '--json',
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

    const handleData = (chunk) => {
      buffer += chunk
      const lines = SplitLines.splitLines(buffer)
      // @ts-ignore
      buffer = lines.pop()
      for (const line of lines) {
        const parsedLine = JSON.parse(line)
        console.log(parsedLine)
        switch (parsedLine.type) {
          case RipGrepParsedLineType.Begin: {
            allSearchResults[parsedLine.data.path.text] = []
            break
          }
          case RipGrepParsedLineType.Match:
            numberOfResults++
            allSearchResults[parsedLine.data.path.text].push(
              toSearchResult(parsedLine)
            )
            break
          case RipGrepParsedLineType.Summary:
            stats = parsedLine.data
            break
          default:
            break
        }
      }
      if (numberOfResults > MAX_SEARCH_RESULTS) {
        limitHit = true
        childProcess.kill()
      }
    }

    const handleClose = () => {
      resolve({
        results: Object.entries(allSearchResults),
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
    childProcess.stdout.on('data', handleData)
    childProcess.once('close', handleClose)
    childProcess.once('error', handleError)
  })
}
