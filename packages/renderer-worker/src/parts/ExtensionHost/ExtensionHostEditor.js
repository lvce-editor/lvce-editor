import * as ExtensionHostShared from './ExtensionHostShared.js'

export const execute = ({
  editor,
  args,
  event,
  method,
  combineResults,
  noProviderFoundMessage,
}) => {
  // TODO wait for languages to load
  return ExtensionHostShared.executeProviders({
    event: `${event}:${editor.languageId}`,
    method: method,
    params: [editor.id, ...args],
    noProviderFoundMessage,
    combineResults: combineResults,
    noProviderFoundResult: [],
  })
}
