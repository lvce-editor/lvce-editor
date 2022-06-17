export const executeDiagnosticProvider = async (extensionHost, documentId) => {
  const diagnostics = await extensionHost.invoke(
    'Diagnostic.execute',
    documentId
  )
  return diagnostics
}
