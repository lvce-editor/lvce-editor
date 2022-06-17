export const handleQuickPickResult = (extensionHost, index) => {
  return extensionHost.invoke(
    'ExtensionHostQuickPick.handleQuickPickResult',
    index
  )
}
