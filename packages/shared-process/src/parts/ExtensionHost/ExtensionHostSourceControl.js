export const sourceControlAcceptInput = (extensionHost, text) => {
  return extensionHost.invoke('SourceControl.acceptInput', text)
}

export const getSourceControlChangedFiles = async (extensionHost) => {
  const changedFiles = await extensionHost.invoke(
    'getSourceControlChangedFiles'
  )
  return changedFiles
}

export const getSourceControlBadgeCount = async (extensionHost) => {
  const count = await extensionHost.invoke('getSourceControlBadgeCount')
  return count
}
