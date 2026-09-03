import { PlainMessagePortRpcParent } from '../../../../../static/js/lvce-editor-rpc.js'
import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.js'

export const handleMockDialogWorkerMessagePort = async (port: MessagePort): Promise<void> => {
  await PlainMessagePortRpcParent.create({
    commandMap: {
      'ConfirmPrompt.prompt': ConfirmPrompt.prompt,
    },
    messagePort: port,
  })
}
