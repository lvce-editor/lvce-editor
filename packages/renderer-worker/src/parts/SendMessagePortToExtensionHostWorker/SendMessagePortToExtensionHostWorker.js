import * as Assert from '../Assert/Assert.ts'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ErrorWorker from '../ErrorWorker/ErrorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as MarkdownWorker from '../MarkdownWorker/MarkdownWorker.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'

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

export const sendMessagePortToMarkdownWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await MarkdownWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToFileSystemWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await FileSystemWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToIconThemeWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await IconThemeWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

// TODO add only one function sendMessagePortToRpc(rpcId) which sends it to the matching rpc module
