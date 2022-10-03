import * as Languages from '../Languages/Languages.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const execute = async ({
  editor,
  args,
  event,
  method,
  combineResults,
  noProviderFoundMessage,
}) => {
  // TODO maybe load languages before showing editor
  // then could skip this if else statement for
  // all editor requests, only downside would be that
  // loading languages takes ~6ms and that would slow down
  // loading editor content and showing editor by 6ms
  if (!Languages.hasLoaded()) {
    await Languages.waitForLoad()
    const newEditor = ViewletStates.getState('EditorText')
    return ExtensionHostShared.executeProviders({
      event: `${event}:${newEditor.languageId}`,
      method: method,
      params: [newEditor.id, ...args],
      noProviderFoundMessage,
      combineResults: combineResults,
      noProviderFoundResult: [],
    })
  }
  return ExtensionHostShared.executeProviders({
    event: `${event}:${editor.languageId}`,
    method: method,
    params: [editor.id, ...args],
    noProviderFoundMessage,
    combineResults: combineResults,
    noProviderFoundResult: [],
  })
}
