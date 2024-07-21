import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const execute = async ({ editor, args, event, method, combineResults, noProviderFoundMessage, noProviderFoundResult = undefined }: any) => {
  // @ts-ignore
  const result = await ExtensionHostWorker.invoke(method, editor.uid, ...args)
  // promises.push(extensionHost.ipc.invoke(method, ...params))

  // return ExtensionHostShared.executeProviders({
  //   event: `${event}:${editor.languageId}`,
  //   method: method,
  //   params: [editor.uid, ...args],
  //   noProviderFoundMessage,
  //   combineResults: combineResults,
  //   noProviderFoundResult,
  // })
}
