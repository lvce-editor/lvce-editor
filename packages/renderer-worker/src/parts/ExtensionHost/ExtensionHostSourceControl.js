import * as ExtensionHost from './ExtensionHostCore.js'

export const acceptInput = async (text) => {
  await ExtensionHost.invoke(
    /* ExtensionHost.sourceControlAcceptInput */ 'ExtensionHost.sourceControlAcceptInput',
    /* message */ text
  )
}

export const getChangedFiles = async () => {
  return ExtensionHost.invoke(
    /* ExtensionHost.sourceControlGetChangedFiles */ 'ExtensionHost.sourceControlGetChangedFiles'
  )
}

export const getFileBefore = async (path) => {
  return ExtensionHost.invoke(
    /* SourceControl.getFileBefore */ 'ExtensionHost.sourceControlGetFileBefore',
    /* path */ path
  )
}
