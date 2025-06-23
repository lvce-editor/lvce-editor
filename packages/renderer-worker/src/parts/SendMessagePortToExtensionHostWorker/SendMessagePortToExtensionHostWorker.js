import * as Assert from '../Assert/Assert.ts'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ErrorWorker from '../ErrorWorker/ErrorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const sendMessagePortToExtensionHostWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ExtensionHostWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToSharedProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SharedProcess.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToErrorWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ErrorWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToEditorWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await EditorWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToRendererProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await RendererProcess.invokeAndTransfer(initialCommand, port, rpcId)
}
