import VError from 'verror'
import * as Callback from '../Callback/Callback.js'
import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as Debug from '../Debug/Debug.js'
import * as Error from '../Error/Error.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import * as Socket from '../Socket/Socket.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Platform from '../Platform/Platform.js'

const getExtensionKeyBindings = (extension) => {
  return extension.keyBindings || []
}

export const getKeyBindings = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const keyBindings = extensions.flatMap(getExtensionKeyBindings)
  return keyBindings
}
