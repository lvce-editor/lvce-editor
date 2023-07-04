import * as CollectTextSearchStdout from '../CollectTextSearchStdout/CollectTextSearchStdout.js'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.js'
import * as RipGrep from '../RipGrep/RipGrep.js'
import { TextSearchError } from '../TextSearchError/TextSearchError.js'
import * as WaitForProcessToExit from '../WaitForProcessToExit/WaitForProcessToExit.js'

// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

export const search = async ({ searchDir = '', maxSearchResults = 20_000, ripGrepArgs = [] } = {}) => {
  const charsBefore = 26
  const charsAfter = 50
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const pipeLinePromise = CollectTextSearchStdout.collectStdout(childProcess, maxSearchResults, charsBefore, charsAfter)
  const closePromise = WaitForProcessToExit.waitForProcessToExit(childProcess)
  const [pipeLineResult, exitResult] = await Promise.all([pipeLinePromise, closePromise])
  if (exitResult.type === ProcessExitEventType.Error) {
    throw new TextSearchError(exitResult.event)
  }
  return pipeLineResult
}
