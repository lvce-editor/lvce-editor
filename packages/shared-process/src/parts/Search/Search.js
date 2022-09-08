import { spawn } from 'node:child_process'
import * as RgPath from '../RgPath/RgPath.js'
import * as Platform from '../Platform/Platform.js'

const MAX_SEARCH_RESULTS = 300

const toSearchResult = (parsedLine) => ({
  preview: parsedLine.data.lines.text,
  absoluteOffset: parsedLine.data.absolute_offset,
})

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

const ParsedLineType = {
  Begin: 'begin',
  Match: 'match',
  Summary: 'summary',
}

export const search = async (searchDir, searchString) => {
  // TODO reject promise when ripgrep search fails
  return new Promise((resolve, reject) => {
    const childProcess = useNice
      ? spawn(
          'nice',
          [
            '-20',
            RgPath.rgPath,
            '--smart-case',
            '--stats',
            '--json',
            searchString,
            '.',
          ],
          {
            cwd: searchDir,
          }
        )
      : spawn(
          RgPath.rgPath,
          ['--smart-case', '--stats', '--json', searchString, '.'],
          {
            cwd: searchDir,
          }
        )
    const allSearchResults = Object.create(null)
    let buffer = ''
    let stats = {}
    let numberOfResults = 0
    // TODO use pipeline / transform stream maybe
    childProcess.stdout.on('data', (chunk) => {
      buffer += chunk
      const lines = buffer.split('\n')
      // @ts-ignore
      buffer = lines.pop()
      for (const line of lines) {
        const parsedLine = JSON.parse(line)
        switch (parsedLine.type) {
          case ParsedLineType.Begin: {
            allSearchResults[parsedLine.data.path.text] = []
            break
          }
          case ParsedLineType.Match: {
            numberOfResults++
            allSearchResults[parsedLine.data.path.text].push(
              toSearchResult(parsedLine)
            )
            break
          }
          case ParsedLineType.Summary:
            stats = parsedLine.data
            break
          default:
            break
        }
      }
      if (numberOfResults > MAX_SEARCH_RESULTS) {
        childProcess.kill()
      }
    })
    childProcess.once('close', () => {
      resolve({
        results: Object.entries(allSearchResults),
        stats,
      })
    })
    childProcess.once('error', (error) => {
      // TODO check type of error
      console.error(error)
      resolve({
        results: [],
        stats,
      })
    })
  })
}
