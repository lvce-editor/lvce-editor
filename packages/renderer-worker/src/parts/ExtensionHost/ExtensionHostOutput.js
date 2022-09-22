import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results.flat(1)
}

export const getOutputChannels = () => {
  return ExtensionHostShared.execute({
    method: 'ExtensionHostOutput.getOutputChannels',
    params: [],
    combineResults,
  })
}
