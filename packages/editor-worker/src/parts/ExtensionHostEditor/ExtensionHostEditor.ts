import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as ActivateByEvent from '../ActivateByEvent/ActivateByEvent.ts'

export const execute = async ({ editor, args, event, method, noProviderFoundMessage, noProviderFoundResult = undefined }: any) => {
  const fullEvent = `${event}:${editor.languageId}`
  await ActivateByEvent.activateByEvent(fullEvent)
  const result = await ExtensionHostWorker.invoke(method, editor.uid, ...args)
  return result
}
