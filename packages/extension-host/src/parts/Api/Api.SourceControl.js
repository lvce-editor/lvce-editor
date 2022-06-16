import _ from 'lodash'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const state = {
  /**
   * @type{any[]}
   */
  sourceControlProviders: [],
}

export const registerSourceControlProvider = (sourceControlProvider) => {
  state.sourceControlProviders.push(sourceControlProvider)
}

export const updateGitDecorations = () => {
  SharedProcess.send({
    jsonrpc: '2.0',
    method: 'updateGitDecorations',
    params: [],
  })
}

export const getBadgeCount = async (cwd) => {
  const getBadgeCountInCwd = (provider) => provider.getBadgeCount(cwd)
  const individualCounts = await Promise.all(
    state.sourceControlProviders.map(getBadgeCountInCwd)
  )
  const total = _.sum(individualCounts)
  return total
}

export const sourceControlGetModifiedFiles = async () => {
  // TODO maybe use Promise.allsettled so that when one provider fails, it still shows some results
  const result = await Promise.all(
    Object.values(state.sourceControlProviders).map((provider) =>
      provider.getChangedFiles()
    )
  )
  const flatResult = result.flat(1)
  return flatResult
}
