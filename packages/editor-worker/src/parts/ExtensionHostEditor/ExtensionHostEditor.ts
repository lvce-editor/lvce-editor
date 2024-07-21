import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

/**
 *
 * @param {any} param0
 * @returns
 */
export const execute = async ({ editor, args, event, method, combineResults, noProviderFoundMessage, noProviderFoundResult = undefined }: any) => {
  const result = await ExtensionHostWorker.invoke(method, editor.uid, ...args)
  promises.push(extensionHost.ipc.invoke(method, ...params))

  return ExtensionHostShared.executeProviders({
    event: `${event}:${editor.languageId}`,
    method: method,
    params: [editor.uid, ...args],
    noProviderFoundMessage,
    combineResults: combineResults,
    noProviderFoundResult,
  })
}
