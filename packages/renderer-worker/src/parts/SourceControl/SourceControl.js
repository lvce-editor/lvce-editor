import * as ExtensionHostSourceControl from '../ExtensionHost/ExtensionHostSourceControl.js'

export const acceptInput = (text) => {
  return ExtensionHostSourceControl.acceptInput(text)
}

export const getChangedFiles = () => {
  return ExtensionHostSourceControl.getChangedFiles()
}

export const getFileBefore = (file) => {
  return ExtensionHostSourceControl.getFileBefore(file)
}
