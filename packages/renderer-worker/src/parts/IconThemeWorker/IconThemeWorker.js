import { PlainMessagePortRpcParent } from '../../../../../static/js/lvce-editor-rpc.js'
import * as StaticFileIcons from '../StaticFileIcons/StaticFileIcons.ts'
import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import { launchIconThemeWorker } from '../LaunchIconThemeWorker/LaunchIconThemeWorker.js'

const worker = GetOrCreateWorker.getOrCreateWorker(launchIconThemeWorker)

export const invoke = (method, ...args) => {
  if (StaticFileIcons.isEnabled()) {
    return StaticFileIcons.commandMap[method](...args)
  }
  return worker.invoke(method, ...args)
}

export const invokeAndTransfer = async (method, port, ...args) => {
  if (StaticFileIcons.isEnabled()) {
    await PlainMessagePortRpcParent.create({ commandMap: StaticFileIcons.commandMap, messagePort: port })
    return
  }
  return worker.invokeAndTransfer(method, port, ...args)
}
