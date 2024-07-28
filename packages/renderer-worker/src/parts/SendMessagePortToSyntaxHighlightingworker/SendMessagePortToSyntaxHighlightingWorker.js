import * as Assert from '../Assert/Assert.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.js'

export const sendMessagePortToSyntaxHighlightingWorker = async (port, initialCommand) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SyntaxHighlightingWorker.invokeAndTransfer([port], initialCommand, port)
}
